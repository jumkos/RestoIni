import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Button,
  TouchableHighlight,
  StatusBar,
} from 'react-native';
import { WebBrowser } from 'expo';
import {
  List, ListItem, Avatar, 
  SearchBar, Header
} from 'react-native-elements';
import _ from "lodash";
import ModalScreen from './ModalScreen';
import Modal from "react-native-modal";
import { SafeAreaView } from 'react-navigation';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: false,
      query: '',
      fullData: [],
      id: null,
      image: null,
      isModalVisible: false
    };
  }

  static navigationOptions = {
    header: null,
  };

  toggleModal = (id,image) => {
    this.setState({ 
      id: id,
      image: image,
      isModalVisible: true,
    });
  };

  handleSearch = (text) => {
    const formatQuery = text.toLowerCase();
    const data = _.filter(this.state.fullData, data => {
      if (data.Name.toLowerCase().includes(formatQuery)) {
        return true;
      }
      return false;
    });
    this.setState({ query: text, isModalVisible: false, data });

  }

  componentDidMount() {
    this.makeRemoteRequest();
  }

  makeRemoteRequest = () => {
    const { page, seed } = this.state;
    const url = `http://192.168.1.7:8889/Resto/api/foods/getfoods`;
    this.setState({ loading: true });
    fetch(url, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "authorization": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJJZCI6IjMiLCJNX0dyb3VwdXNlcl9JZCI6IjEiLCJNX1ZlbmRvcl9JZCI6IjMiLCJVc2VybmFtZSI6ImFuZGlrIiwiUGFzc3dvcmQiOiI4ZDNlNjdiY2UyN2Y4MGI5YmU5NDNkYTViMzE2ZjVmOSIsIklzTG9nZ2VkSW4iOiIwIiwiSXNBY3RpdmUiOiIxIiwiTGFuZ3VhZ2UiOiJpbmRvbmVzaWEiLCJDcmVhdGVkQnkiOiJzdXBlcmFkbWluIiwiTW9kaWZpZWRCeSI6bnVsbCwiQ3JlYXRlZCI6IjIwMTktMDUtMjIgMTM6MTI6MjUiLCJNb2RpZmllZCI6IjIwMTktMDUtMjMgMTU6NDA6MDEifQ.-pZ6B-iwGN_HZhWwYYyFIJUCWUilKYs3mGQhmzO6toI"
      }
    }
    )
      .then(res => res.json())
      .then(res => {

        this.setState({
          data: page === 1 ? res.results : [...this.state.data, ...res.results],
          fullData: page === 1 ? res.results : [...this.state.data, ...res.results],
          error: res.error || null,
          loading: false,
          refreshing: false
        });
      }
      )
      .catch(error => {
        console.log("catct", error);
        this.setState({ error, loading: false });
      });
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      />
    );
  };

  renderHeader = () => {
    return <SearchBar placeholder="Type Here..." lightTheme round onChangeText={this.handleSearch} value={this.state.query} />;
  };

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  render() {
    const { query } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
        <Header
          leftComponent={{ icon: 'menu', color: '#fff' }}
          centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
          rightComponent={{ icon: 'home', color: '#fff' }}
          containerStyle={{
            backgroundColor: '#33b35a',
            justifyContent: 'space-around',
          }}
        />
        <SearchBar placeholder="Type Here..." lightTheme round onChangeText={this.handleSearch} value={query} />
        <FlatList
          data={this.state.data}
          renderItem={({ item }) =>

            (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.toggleModal(item.Id, item.Photos[0].Url);
                }}
                
              >
                <ListItem

                  roundAvatar
                  title={`${item.Name}`}
                  subtitle={item.Vendor.Name}
                  leftAvatar={<Avatar
                    size="medium"
                    source={{
                      uri: `http://192.168.1.33/publicRes/${item.Photos[0].Url}`,
                    }}
                  />}
                  rightSubtitle={`Rp. ${item.Price}`}
                  rightSubtitleStyle={{
                    color: '#33b35a'
                  }}
                />
              </TouchableOpacity>
            )}
            
          keyExtractor={item => item.Name}
          ItemSeparatorComponent={this.renderSeparator}
          ListFooterComponent={this.renderFooter}
        />
        <ModalScreen 
        modalVisible={this.state.isModalVisible}
        setIsModalVisible={vis => {
          this.setState({ isModalVisible: vis });
        }}
        id={this.state.id}
        image={this.state.image}
        >
        </ModalScreen>
      </View>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.hhhh
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
