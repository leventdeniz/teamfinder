import { createAction } from 'redux-actions'
import keyMirror from 'keymirror'
import { createUrl, metaGenerator } from 'utils'
import fetch from 'isomorphic-fetch'

const actions = keyMirror({
    REQUEST_PLAYER_SEARCH: null,
    RECEIVE_PLAYER_SEARCH: null,
    REQUEST_PLAYER: null,
    RECEIVE_PLAYER: null,
    REQUEST_NEXT_PAGE_OF_PLAYERS: null,
    RECEIVE_NEXT_PAGE_OF_PLAYERS: null
})
export default actions

const fetchGET = url => fetch(url, {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
})

export const requestPlayerSearch = (values) => (dispatch, getState) => {
    dispatch(createAction(actions.REQUEST_PLAYER_SEARCH)())
    const { keywords, regions, positions, skillBracket } = values
    let url = createUrl(`/api/players/?keywords=${keywords}&skill_bracket=${skillBracket}`)
    regions.forEach(region => url += `&regions[]=${region}`)
    positions.forEach(position => url += `&positions[]=${position}`)
    return fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    }).then(response => response.json().then(json => {
        const payload = response.ok ? json : new Error('Error retrieving player search results.')
        dispatch(createAction(actions.RECEIVE_PLAYER_SEARCH, null, metaGenerator)(payload))
        if (!response.ok) {
            return Promise.reject(json)
        }
        return json
    }))
}

export const requestPlayer = id => (dispatch, getState) => {
    dispatch(createAction(actions.REQUEST_PLAYER)())
    const { results } = getState().playerSearch
    const player = results.find(result => result.id === id)
    if (player) {
        return dispatch(createAction(actions.RECEIVE_PLAYER, null, metaGenerator)(player))
    } else {
        const url = createUrl(`/api/players/${id}/`)
        return fetchGET(url).then(response => response.json().then(json => {
            const payload = response.ok ? json : new Error('Error retrieving player results.')
            return dispatch(createAction(actions.RECEIVE_PLAYER, null, metaGenerator)(payload))
        }))
    }
}

export const requestNextPageOfPlayers = () => (dispatch, getState) => {
    dispatch(createAction(actions.REQUEST_NEXT_PAGE_OF_PLAYERS)())
    const nextPage = getState().playerSearch.next
    return fetch(nextPage, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    }).then(response => response.json().then(json => {
        const payload = response.ok ? json : new Error('Error retrieving next page of player search results.')
        dispatch(createAction(actions.RECEIVE_NEXT_PAGE_OF_PLAYERS, null, metaGenerator)(payload))
        if (!response.ok) {
            return Promise.reject(json)
        }
        return json
    }))
}