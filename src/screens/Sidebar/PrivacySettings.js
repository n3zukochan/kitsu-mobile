import React, { Component } from 'react';
import { View, Image, TextInput, StyleSheet, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Text, Button, Container, Content, Spinner, Switch, Icon, Left, Right, Item } from 'native-base';
import PropTypes from 'prop-types';
import SidebarHeader from './common/SidebarHeader';
import SidebarTitle from './common/SidebarTitle';
import SidebarListItem, { ItemSeparator } from './common/SidebarListItem';
import * as colors from '../../constants/colors';

import menu from '../../assets/img/tabbar_icons/menu.png';
import library from '../../assets/img/sidebar_icons/library.png';
import privacy from '../../assets/img/sidebar_icons/privacy.png';
import linked from '../../assets/img/sidebar_icons/linked.png';
import blocking from '../../assets/img/sidebar_icons/blocking.png';
import settings from '../../assets/img/sidebar_icons/settings.png';

class PrivacySettings extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: () => <SidebarHeader navigation={navigation} headerTitle={'Privacy'} />,
    tabBarIcon: (
      { tintColor },
    ) => (
      <Image
        source={menu}
        style={{ tintColor, width: 20, height: 21 }}
      />
    ),
  });

  render() {
    const { navigation } = this.props;
    const loading = false; // temporary.
    return ( // handle marginTop: 77
      <Container style={styles.containerStyle}>
        <Content scrollEnabled={false}>
          <View style={{ flex: 1, marginTop: 77 }}>
            <SidebarTitle style={{ marginTop: 20 }} title={'Personal Settings'} />
            <View style={{ flexDirection: 'row', backgroundColor: 'white', paddingHorizontal: 12, paddingVertical: 16, alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14 }}>Share posts to Global Feed</Text>
              <Switch />
            </View>
            <ItemSeparator />
            <View style={{ backgroundColor: 'white', paddingHorizontal: 12, paddingVertical: 8 }}>
              <Text style={{ fontSize: 10, color: 'grey' }}>If disabled, your posts will only be shared to your followers and guests to your profile.</Text>
            </View>
            <View style={{ marginTop: 20, padding: 10, paddingLeft: 25, paddingRight: 25 }}>
              <Button
                block
                disabled={false && loading}
                onPress={() => {}}
                style={{
                  backgroundColor: colors.lightGreen,
                  height: 47,
                  borderRadius: 3,
                }}
              >
                {loading
                  ? <Spinner size="small" color="rgba(255,255,255,0.4)" />
                  : <Text
                    style={{
                      color: colors.white,
                      fontFamily: 'OpenSans-Semibold',
                      lineHeight: 20,
                      fontSize: 14,
                    }}
                  >
                      Save Privacy Settings
                    </Text>}
              </Button>
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = {
  containerStyle: { backgroundColor: colors.listBackPurple },
};

const mapStateToProps = ({ user }) => {
  return {
  };
};

PrivacySettings.propTypes = {
};

export default connect(mapStateToProps, { })(PrivacySettings);
