import React from 'react';
import {
  Text,
  View,
  Modal,
  TouchableHighlight,
} from 'react-native';
import Slideshow from 'react-native-image-slider-show';

export default class ModalScreen extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        modalVisible: props.modalVisible,
        id: null,
        image: null,
      };
    }
  
    componentWillReceiveProps(nextProps) {
      this.setState({
        modalVisible: nextProps.modalVisible,
        id: nextProps.id,
        image: nextProps.price,
      });
    }
  
    render() {
    console.log("asd", this.state.image);
    console.log("id", this.state.id);
      return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.props.setModalVisible(false);
          }}
        >
          <View style={{ marginTop: 22 }}>
            <View>
              <Slideshow
                dataSource={[
                  { url: this.state.image },
                  { url: this.state.image },
                  { url: this.state.image }
                ]} />

              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible(false);
                }}>
                <Text>Hide Modal</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      );
    }
  }