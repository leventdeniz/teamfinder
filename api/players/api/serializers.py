from players.models import Player
from rest_framework import serializers
from teams.models import Team


class PlayerTeamSerializer(serializers.ModelSerializer):
    """Serializer for nesting a Team object inside a Player"""
    url = serializers.HyperlinkedIdentityField(view_name='team-detail')
    captain = serializers.PrimaryKeyRelatedField(read_only=True)
    creator = serializers.PrimaryKeyRelatedField(read_only=True)

    @staticmethod
    def setup_eager_loading(queryset):
        queryset = queryset.select_related(
            'captain',
            'creator',
        )
        return queryset

    class Meta:
        model = Team
        fields = (
            'id',
            'name',
            'captain',
            'creator',
            'url',
        )
        read_only_fields = (
            'id',
            'name',
            'captain',
            'creator',
            'url',
        )


class BasePlayerSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='player-detail')
    steamid = serializers.CharField(source='user.steamid')
    steam_friends = serializers.ListField(child=serializers.CharField(), source='user.steam_friends')
    email = serializers.EmailField(source='user.email')
    username = serializers.CharField(source='user.username')
    avatar = serializers.CharField(source='user.avatar')
    avatarfull = serializers.CharField(source='user.avatarfull')
    last_login = serializers.CharField(source='user.last_login')

    def update(self, instance, validated_data):
        user = validated_data.pop('user')

        if user:
            email = user.pop('email')
            if email:
                instance.user.email = email
                instance.user.save()

        return super(BasePlayerSerializer, self).update(instance, validated_data)

    @staticmethod
    def setup_eager_loading(queryset):
        queryset = queryset.prefetch_related(
            'positions',
            'regions',
            'teams',
        ).select_related(
            'user'
        )
        return queryset

    class Meta:
        model = Player
        fields = (
            'id',
            'url',
            'steamid',
            'steam_friends',
            'username',
            'email',
            'last_login',
            'regions',
            'positions',
            'interests',
            'teams',
            'avatar',
            'avatarfull',
            'mmr',
            'mmr_estimate',
            'mmr_last_updated',
        )
        read_only_fields = (
            'id',
            'url',
            'steamid',
            'steam_friends',
            'username',
            'last_login',
            'avatar',
            'avatarfull',
            'mmr',
            'mmr_estimate',
            'mmr_last_updated',
        )


class FlatPlayerSerializer(BasePlayerSerializer):
    pass


class PlayerSerializer(BasePlayerSerializer):
    regions = serializers.PrimaryKeyRelatedField(read_only=True, many=True)
    positions = serializers.PrimaryKeyRelatedField(read_only=True, many=True)
    interests = serializers.PrimaryKeyRelatedField(read_only=True, many=True)
    teams = PlayerTeamSerializer(read_only=True, many=True)



