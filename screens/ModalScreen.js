import React from 'react';
import {
    Text,
    View,
    TouchableHighlight,
    StatusBar,
    Button,
} from 'react-native';
import Modal from "react-native-modal";
import Slideshow from 'react-native-image-slider-show';
export default class ModalScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: props.modalVisible,
            id: null,
            image: '',
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            modalVisible: nextProps.modalVisible,
            id: nextProps.id,
            image: nextProps.image,
        });
    }

    toggleModal = () => {
        this.setState({ modalVisible: false });
    };

    render() {
        const url = `http://192.168.1.33/publicRes/${this.state.image}`;
        return (
            <Modal isVisible={this.state.modalVisible}
                style={{
                    margin: 0
                }}
            >
                <View style={{
                    flex: 1
                }}>
                    <View style={{ flex: 1, backgroundColor: 'transparent' }}
                        opacity={1}
                    >
                        <Slideshow
                            height={220}
                            dataSource={[
                                { url: url },
                                { url: url },
                                { url: url }
                            ]}
                        />
                    </View>
                    <View style={{ flex: 2, backgroundColor: '#fff', height: 600 }} >
                        <Text>Hello!</Text>
                        <Button title="Hide modal" onPress={this.toggleModal} />
                    </View>
                </View>
            </Modal>
        );
    }
}