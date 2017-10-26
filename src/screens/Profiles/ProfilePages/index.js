import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StatusBar } from 'react-native';
import { TabRouter } from 'react-navigation';
import { connect } from 'react-redux';
import ParallaxScroll from '@monterosa/react-native-parallax-scroll';

import { Kitsu } from 'kitsu/config/api';
import { defaultCover } from 'kitsu/constants/app';
import { listBackPurple } from 'kitsu/constants/colors';
import { TabBar, TabBarLink } from 'kitsu/screens/Profiles/components/TabBar';
import { SceneHeader } from 'kitsu/screens/Profiles/components/SceneHeader';
import { SceneContainer } from 'kitsu/screens/Profiles/components/SceneContainer';
import { MaskedImage } from 'kitsu/screens/Profiles/components/MaskedImage';
import { CustomHeader } from 'kitsu/screens/Profiles/components/CustomHeader';
import Summary from 'kitsu/screens/Profiles/ProfilePages/pages/Summary';
import { coverImageHeight } from 'kitsu/screens/Profiles/constants';

// There's no way to Report Profiles at the moment in the API.
const MORE_BUTTON_OPTIONS = ['Block', /* 'Report Profile', */ 'Nevermind'];

const tabPage = name => ({ key: name.toLowerCase(), label: name, screen: name });

const TAB_ITEMS = [
  tabPage('Summary'),
  tabPage('About'),
  tabPage('Library'),
  tabPage('Groups'),
  tabPage('Reactions'),
];

/* eslint-disable global-require */

const TabRoutes = TabRouter({
  Summary: { screen: Summary },
  About: { getScreen: () => require('./pages/About').About },
  Library: { getScreen: () => require('./pages/Library').Library },
  Groups: { getScreen: () => require('./pages/Groups').Groups },
  Reactions: { getScreen: () => require('./pages/Reactions').Reactions },
}, {
  initialRouteName: 'Summary',
});

class ProfilePage extends PureComponent {
  static navigationOptions = {
    header: null,
  }

  static propTypes = {
    navigation: PropTypes.object.isRequired,
    userId: PropTypes.number,
    currentUser: PropTypes.object.isRequired,
  }

  static defaultProps = {
    userId: null,
  }

  state = {
    active: 'Summary',
    loading: true,
    error: null,
    profile: null,
    feed: null,
  }

  componentWillMount() {
    const userId = this.props.userId || (this.props.navigation.state.params || {}).userId;

    if (!userId) {
      this.setState({
        loading: false,
        error: 'Missing userId in component.',
      });

      return;
    }

    this.loadUserData(userId);
  }

  onMoreButtonOptionsSelected = async (button) => {
    if (button === 'Block') {
      await Kitsu.create('blocks', {
        blocked: { id: this.props.userId },
        user: { id: this.props.currentUser.id },
      });
    } else if (button === 'Report Profile') {
      // There's no current way to report users from the site.
      // Once there is, the API call goes here.
    }
  }

  setActiveTab = (tab) => {
    this.setState({ active: tab });
  }

  loadUserData = async (userId) => {
    try {
      const users = await Kitsu.findAll('users', {
        filter: {
          id: userId,
        },
        fields: {
          users: 'waifuOrHusbando,gender,location,birthday,createdAt,followersCount,followingCount,coverImage,avatar,about,name,waifu',
        },
        include: 'waifu',
      });

      if (users.length < 1) {
        console.log(`Could not locate user with ID ${userId}.`);

        this.setState({
          loading: false,
          error: 'Could not find that user.',
        });

        return;
      }

      this.setState({
        loading: false,
        profile: users[0],
      });
    } catch (error) {
      console.log('Error loading user: ', error);

      this.setState({
        loading: false,
        error,
      });
    }
  }

  handleFollowing = () => {}

  renderTabNav = () => (
    <TabBar>
      {TAB_ITEMS.map(tabItem => (
        <TabBarLink
          key={tabItem.key}
          label={tabItem.label}
          isActive={this.state.active === tabItem.screen}
          onPress={() => this.setActiveTab(tabItem.screen)}
        />
      ))}
    </TabBar>
  );

  render() {
    const userId = this.props.userId || (this.props.navigation.state.params || {}).userId;
    const { navigation } = this.props;
    const { error, loading, profile } = this.state;
    const TabScene = TabRoutes.getComponentForRouteName(this.state.active);

    if (loading) {
      // Return loading state.
      return null;
    }

    if (error) {
      // Return error state.
      return null;
    }

    return (
      <SceneContainer>
        <StatusBar barStyle="light-content" />
        <ParallaxScroll
          headerHeight={60}
          isHeaderFixed
          parallaxHeight={coverImageHeight}
          renderParallaxBackground={() => (
            <MaskedImage
              maskedTop
              maskedBottom
              source={{ uri: (profile.coverImage && profile.coverImage.large) || defaultCover }}
            />
          )}
          renderHeader={() => (
            <CustomHeader
              leftButtonAction={this.goBack}
              leftButtonTitle="Back"
            />
          )}
          headerFixedBackgroundColor={listBackPurple}
        >
          <SceneHeader
            variant="profile"
            title={profile.name}
            description={profile.about}
            posterImage={profile.avatar && profile.avatar.large}
            followersCount={profile.followersCount}
            followingCount={profile.followingCount}
            moreButtonOptions={MORE_BUTTON_OPTIONS}
            onFollowButtonPress={this.handleFollowing}
            onMoreButtonOptionsSelected={this.onMoreButtonOptionsSelected}
          />
          {this.renderTabNav()}
          <TabScene
            setActiveTab={tab => this.setActiveTab(tab)}
            userId={userId}
            navigation={navigation}
          />
        </ParallaxScroll>
      </SceneContainer>
    );
  }
}

const mapStateToProps = ({ user }) => {
  const { currentUser } = user;
  return { currentUser };
};

export default connect(mapStateToProps)(ProfilePage);
