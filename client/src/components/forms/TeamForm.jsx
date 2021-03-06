import React, { Component } from "react";
import PropTypes from "prop-types";
import { Field, reduxForm, SubmissionError } from "redux-form";

import { submitCreateTeam, submitEditTeam } from "actions/teams";

import { Alert, Button } from "react-bootstrap";
import {
  createInput,
  createS3UploadInput,
  createSelectInput,
  createTextArea,
  InterestSelect,
  LanguageSelect,
  RegionSelect,
  PositionSelect,
  INVALID_LOGO_DIMENSIONS
} from "components/forms";

const validate = (values, props) => {
  const errors = {};
  const fields = ["name", "regions", "player_position", "available_positions"];
  const multiSelectFields = ["regions", "available_positions"];
  fields.forEach(fieldName => {
    if ([null, undefined, ""].includes(values[fieldName])) {
      errors[fieldName] = "Required";
    }
  });
  multiSelectFields.forEach(fieldName => {
    const value = values[fieldName];
    if (value && value.length < 1) {
      errors[fieldName] = "Required";
    }
  });
  if (values.logo_url && values.logo_url === INVALID_LOGO_DIMENSIONS) {
    errors.logo_url = "Image dimensions are too big.";
  }
  return errors;
};

const NameInput = createInput({ label: "Name" });
const RegionInput = createSelectInput("Regions", RegionSelect);
const PlayerPositionInput = createSelectInput(
  "My Position",
  PositionSelect,
  false
);
const AvailablePositionInput = createSelectInput(
  "Available Positions",
  PositionSelect
);
const InterestInput = createSelectInput("Team Interests", InterestSelect);
const LanguageInput = createSelectInput("Team Languages", LanguageSelect);
const S3UploadInput = createS3UploadInput();
const BioInput = createTextArea({
  label: "Team Bio",
  maxLength: 255
});
class TeamForm extends Component {
  static propTypes = {
    teamId: PropTypes.string,
    showPlayerPosition: PropTypes.bool
  };

  static defaultProps = {
    teamId: null,
    showPlayerPosition: true
  };

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  submit(values, dispatch) {
    const { teamId } = this.props;
    const action = teamId
      ? submitEditTeam(teamId, values)
      : submitCreateTeam(values);
    return dispatch(action).then(({ response, json }) => {
      if (!response.ok) {
        const errors = json;
        if (json.hasOwnProperty("non_field_errors")) {
          errors._error = json.non_field_errors[0];
        }
        throw new SubmissionError(errors);
      }
    });
  }

  render() {
    const {
      error,
      handleSubmit,
      submitting,
      showPlayerPosition,
      teamId
    } = this.props;
    return (
      <form onSubmit={handleSubmit(this.submit)}>
        {error && <Alert bsStyle="danger">{error}</Alert>}
        <div>
          <Field name="name" component={NameInput} />
        </div>
        <div>
          <Field name="regions" component={RegionInput} />
        </div>
        {showPlayerPosition && (
          <div>
            <Field name="player_position" component={PlayerPositionInput} />
          </div>
        )}
        {/* TODO: Add checkbox for "Currently recruiting?" and conditionally display available positions */}
        <div>
          <Field
            name="available_positions"
            component={AvailablePositionInput}
          />
        </div>
        <div>
          <Field name="interests" component={InterestInput} />
        </div>
        <div>
          <Field name="languages" component={LanguageInput} />
        </div>
        {teamId && (
          <div>
            <Field name="logo_url" component={S3UploadInput} />
          </div>
        )}
        <div>
          <Field name="bio" component={BioInput} />
        </div>
        <div>
          <Button type="submit" disabled={submitting}>
            Submit
          </Button>
        </div>
      </form>
    );
  }
}

TeamForm = reduxForm({
  form: "team",
  validate
})(TeamForm);

export default TeamForm;
