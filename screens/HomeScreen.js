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
} from 'react-native';
import { WebBrowser } from 'expo';
import {
  List, ListItem, Avatar,
  SearchBar, Header
} from 'react-native-elements';
import _ from "lodash";

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
    };
  }

  static navigationOptions = {
    header: null,
  };

  handleSearch = (text) => {
      const formatQuery = text.toLowerCase();
      const data = _.filter(this.state.fullData, data => {
        if(data.Name.includes(formatQuery)){
          return true;
        }
        return false;
      });      
      this.setState({query : text, data});
   
  }

  componentDidMount() {
    this.makeRemoteRequest();
  }

  makeRemoteRequest = () => {
    const { page, seed } = this.state;
    const url = `http://192.168.1.25:8889/Resto/api/foods/getfoods`;
    this.setState({ loading: true });
    fetch(url, {
      method: 'GET', 
      headers: {
        "Content-Type" : "application/json",
        "Authorization": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJJZCI6IjMiLCJNX0dyb3VwdXNlcl9JZCI6IjEiLCJNX1ZlbmRvcl9JZCI6IjMiLCJVc2VybmFtZSI6ImFuZGlrIiwiUGFzc3dvcmQiOiI4ZDNlNjdiY2UyN2Y4MGI5YmU5NDNkYTViMzE2ZjVmOSIsIklzTG9nZ2VkSW4iOiIwIiwiSXNBY3RpdmUiOiIxIiwiTGFuZ3VhZ2UiOiJpbmRvbmVzaWEiLCJDcmVhdGVkQnkiOiJzdXBlcmFkbWluIiwiTW9kaWZpZWRCeSI6bnVsbCwiQ3JlYXRlZCI6IjIwMTktMDUtMjIgMTM6MTI6MjUiLCJNb2RpZmllZCI6IjIwMTktMDUtMjMgMTU6NDA6MDEifQ.-pZ6B-iwGN_HZhWwYYyFIJUCWUilKYs3mGQhmzO6toI" 
      }
    }
    )
      .then(res => 
      console.log("a", res.json())) 
      .then(res => { 
        console.log("Res", res);
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
    return <SearchBar placeholder="Type Here..." lightTheme round onChangeText={this.handleSearch} value={this.state.query}/>;
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
        <Header
          leftComponent={{ icon: 'menu', color: '#fff' }}
          centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
          rightComponent={{ icon: 'home', color: '#fff' }}
        />
        <SearchBar placeholder="Type Here..." lightTheme round onChangeText={this.handleSearch} value={query}/>
          <FlatList
            data={this.state.data}
            renderItem={({ item }) => (

              <ListItem
                roundAvatar
                title={`${item.Name}`}
                subtitle={item.Description}
                leftAvatar={<Avatar
                  size="large"
                  source={{
                    uri: "http://192.168.1.33/publicRes/"+item.Url,
                  }}
                />}
                rightSubtitle={`Rp. ${item.Price}`}
              />
            )}
            keyExtractor={item => item.Name}
            ItemSeparatorComponent={this.renderSeparator}
            ListFooterComponent={this.renderFooter}
          />
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
