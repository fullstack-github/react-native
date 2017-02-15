'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  Image,
  ListView,
  StyleSheet,
  Text,
  TouchableHighlight,
  Alert,
  View,
  PropTypes,
  TextInput,
  DrawerLayoutAndroid,
  ActivityIndicator,ToolbarAndroid,
} from 'react-native';

import GridView from 'react-native-grid-view'

var REQUEST_URL = "http://www.foodq.co.in/fontapi.php";
var MOVIES_PER_ROW = 1;
var navigator;
var openDrawer;

class Movie extends Component {
  render() {
      return (
          <View>
            <Text style={[styles.title,{fontFamily:this.props.item.family}]}numberOfLines={1}>{this.props.item.family}</Text>
          </View>
      );
  }
}
var toolbarActions = [];

class MainPage extends Component {
  constructor(props) {
    super(props);
	this.openDrawer = this.openDrawer.bind(this);
    this.state = {
      dataSource: null,
      loaded: false,
	  FontFamilyText: "monospace",
    }
  }
  
  openDrawer() {
    this.drawer.openDrawer();
  }
  closeDrawer(){
	this.drawer.closeDrawer();
	this.setState({
        pressed:false,
    });
  }

  componentDidMount() {
	navigator = this.props.navigator;
    this.fetchData();
  }

  fetchData() {
    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: responseData.items,
          loaded: true,
        });
      })
      .done();
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }
	
	var navigationView = (
		<View style={{flex: 1, backgroundColor: '#000'}}>
			<View style={{backgroundColor: '#2D2D2D'}}>
			  <Text style={{margin: 15, fontSize: 20, color:'#fff', textAlign: 'center'}}>Fonts List</Text>
			  <View style={styles.container}>
				<TextInput
				  style={styles.input}
				  placeholder="Search..."
				  onChangeText={this._handleTextChange.bind(this)}
				/>
			  </View>
			</View>
			<GridView
				items={this.state.dataSource}
				itemsPerRow={MOVIES_PER_ROW}
				renderItem={this.renderItem.bind(this)}
				style={styles.listView}
			/>
		</View>
    );
	
	return (
		<DrawerLayoutAndroid
		  drawerWidth={300}
		  drawerPosition={DrawerLayoutAndroid.positions.Left}
		  renderNavigationView={() => navigationView}
		  ref={(_drawer) => this.drawer = _drawer}>
		  <View style={{flex: 1, alignItems: 'center'}}>
			<View>
				<View title="<ToolbarAndroid>">
					<ToolbarAndroid
						  actions={toolbarActions}
						  onActionSelected={this._onActionSelected}
						  navIcon = {require('./icons/drawer_icon.png')}
						  onIconClicked={this.openDrawer}
						  style={styles.toolbar}
						  sidebarRef={this}
						  title="FontPicker"
						  titleColor='white'/>
				</View>
				<Text style={[styles.textStyle,{fontFamily:this.state.FontFamilyText}]}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</Text>
			</View>
		  </View>
		</DrawerLayoutAndroid>
  );
  }

  renderLoadingView() {
    return (
      <View style={styles.loading}>
			<ActivityIndicator
			  style={[styles.centering, styles.gray]}
			  color="white"
			/>
	 </View>
    );
  }
  
  _handleTextChange(text) {
	 fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
       this.filterStates(text, responseData.items); 
      })
      .done(); 
	 
  }
  
  filterStates(searchText, states) {
    var text = searchText.toLowerCase();
    var rows = [];
   
   for (var i=0; i < states.length; i++) {
     var font_family = states[i].family.toLowerCase();
     if(font_family.search(text) !== -1){
         rows.push({
              family : states[i].family,
          });
     }
   }
       
    this.setState({
       dataSource: rows,
       loaded : true,
     });
  }
  
  onHandleItemPress(item){
	  this.closeDrawer();
	  const FontFamilyText=item.family;
	  this.setState({FontFamilyText});
	  console.log("FontFamilyText::"+this.state.FontFamilyText);
  }
  
  _onActionSelected(position) {
	  
	}

  renderItem(item) {
      return (<TouchableHighlight style={styles.movie} underlayColor="#DADADA" onPress=    {this.onHandleItemPress.bind(this, item)}>
            <View>
            <Movie item={item}/>
            </View>
            </TouchableHighlight>);
  }
}

var styles = StyleSheet.create({
  movie: {
    height: 50,
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
  },
  title: {
    marginBottom: 8,
	marginTop:8,
	fontSize: 20,
    textAlign: 'center',
  },
  year: {
	fontSize: 10,
    textAlign: 'center',
  },
  thumbnail: {
    width: 53,
    height: 81,
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
	loading: {
	flex: 1,
	alignItems: 'center',
	justifyContent: 'center'
  },
	toolbar: {
	backgroundColor: '#2D2D2D',
	height: 56,
  },
	centering: {
	alignItems: 'center',
	justifyContent: 'center',
	padding: 8,
  },
	gray: {
	backgroundColor: '#cccccc',
  },
	textStyle: {
	flex: 1,
	padding: 20,
	fontSize: 18,
	fontFamily: 'monospace',
	backgroundColor: '#F5FCFF'
  },
  container: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C1C1C1',
  },
  input: {
    height: 40,
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
});

module.exports = MainPage;