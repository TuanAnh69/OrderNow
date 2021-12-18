import React from 'react';
import {
  Alert,
  Button,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import {RadioButton, Checkbox, TouchableRipple} from 'react-native-paper';
import deleteIcon from '../../../../img/Delete.png';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Textarea from 'react-native-textarea';


const AddProduct = () => {
  const [checked, setChecked] = React.useState('1'); //type
  const [sizeM, setSizeMChecked] = React.useState(false);
  const [sizeL, setSizeLChecked] = React.useState(false);
  const [sizeXL, setSizeXLChecked] = React.useState(false);
  const [sizeXXL, setSizeXXLChecked] = React.useState(false);
  const [images, setImages] = React.useState([]);
  const [idSP,setIdSP] = React.useState(null);

    //console.log(listIMG);
  images?.length > 6 && setImages([]);
  let listIMG = [];
  images?.map(e =>listIMG.push(e));

  let uploadUri = listIMG;
    //let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
    let filename = [];
    uploadUri.map(e => {
      filename.push(e.substring(e.lastIndexOf('/') + 1));
      
    })
console.log(listIMG);

const uploadProducts = Yup.object().shape({
  name: Yup.string()
    .max(30, () => `Tên tối đa 30 ký tự.`)
    .matches(/(\w.+\s).+/, 'Vui lòng nhập tên sản phẩm.')
    .required('Bạn chưa nhập tên sản phẩm.'),
  price: Yup.string()
    .matches(/^(\d)(?=.{4,})(?=.*[0-9])/, 'Số tiền không hợp lệ.')
    .required('Bạn chưa nhập giá sản phẩm'),
  color: Yup.string()
    .required('Bạn chưa nhập màu sắc.'),
  info: Yup.string()
    .max(300, () => `Tên tối đa 300 ký tự.`)
    .matches(/(\w.+\s).+/, 'Vui lòng nhập mô tả.')
    .required('Bạn chưa mô tả sản phẩm.'),
});

const resetState =()=> {
  setChecked('1');
  setName('');
  setPrice(0);
  setSizeMChecked(false);
  setSizeLChecked(false);
  setSizeXLChecked(false);
  setSizeXXLChecked(false);
  setInfo('');
  setColor([]);
  setImages([]);
  setIdSP(null);
}
    {
      /*
      // Add timestamp to File Name
    let extension = [];
    //const extension = filename.split('.').pop();
    filename.map(e => extension.push(e.split('.').pop()));
    //const name = filename.split('.').slice(0, -1).join('.');
    let name = [];
    filename.map(ex => name.push(ex.split('.').slice(0, -1).join('.')));

    //filename = name + Date.now() + '.' + extension;
      */
    }
    


  const choosePhotoFromLibrary = async () => {
    ImagePicker.openPicker({
      multiple: true,
      waitAnimationEnd: false,
      includeExif: true,
      forceJpg: true,
      maxFiles: 6, //ios only :(
      compressImageQuality: 0.8,
      mediaType: 'photo',
      includeBase64: true,
    })
      .then(image => {
        let x = [];
        image.map(e => {
          x.push(e.path);
        })
        setImages(x);
        listIMG.push(x);
      })
      .catch(err => {
        console.log('openCamera catch' + err.toString());
        ToastAndroid.show('Tải ảnh lên thất bại!.', ToastAndroid.SHORT);
      });
  };

  const submitImg = async () => {

    //if(typecheck == 2)
    let imageUrl = await uploadImage();
    console.log('Image Url: ', imageUrl);

    firestore()
      .collection('Products')
      .doc(idSP)
      .set({
        id: idSP,
        url: imageUrl,

      })
      .then(() => {
        console.log('Product Added!');
        resetState();
        ToastAndroid.show(
          'Thêm sản phẩm thành công!.',
          ToastAndroid.SHORT,
        );
      })
      .catch(error => {
        console.log(
          'Something went wrong with added post to firestore.',
          error,
        );
        ToastAndroid.show('Thêm thất bại!.', ToastAndroid.SHORT);
      });
  };

  

  const uploadImage = async () => {
    if (listIMG == null) {
      return null;
    }
    var ID = function () {
      return 'SP_' + Math.random().toString(36).substr(2, 5);
    };

    setIdSP(ID);
    console.log("id sản phẩm: ",+idSP);
    let uploadUri = listIMG;
    
    //let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
    let filename = [];
    uploadUri.map(e => {
      filename.push(e.substring(e.lastIndexOf('/') + 1));
    })

    let url = [];
    let i = 0;
    let j = 0;
    
    while(i < filename.length)
    {
      let storageRef = storage().ref(`Products/${idSP}/${filename[i]}`);
      let task = storageRef.putFile(uploadUri[j]);
      i++;
      j++;
      try{
        await task;
        let link = await storageRef.getDownloadURL();
        url.push(link);
      }
      catch(e){

      }
    }
    console.log('list url:'+url);
    return url;
  };

const onDelete = (value) => {
  const data = listIMG.filter(
    (item) => item !== value
  );
  setImages(data);
};
 
  return (
    <SafeAreaView style={{flex: 1}}>
  <Formik
          validationSchema={uploadProducts}
          initialValues={{
            name: '',
            price: '',
            color: '',
            info: '',
          }}
          validateOnMount={true}
          onSubmit={values => console.log(values)}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isValid,
          }) => (
      <View style={{flex:1}}>
      <View style={{flex: 9.4}}>
      
      <ScrollView>
        <View style={{height:'100%'}}>

          <View style={styles.wrappItem}>
            <View style={{width: '30%', justifyContent:'center'}}>
              <Text style={styles.label}>Tên sản phẩm</Text>
            </View>
            <View style={{width: '70%', height: 35}}>
              <TextInput 
                style={{width: 250, borderWidth: 1, borderRadius: 10, backgroundColor:'#ffff'}}
                autoFocus={true}
                autoCapitalize="none"
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
               />
            </View>
          </View>

            {errors.name && touched.name && (
              <View style={{width: '100%', flexDirection:'row'}}>
                <View style={{width: '30%'}}></View>
                <View style={{width: '70%'}}>
                  <Text style={styles.text_err}>{errors.name}</Text> 
                </View>
              </View>
            )}

          {/*Loại sản phẩm */}

          <View style={styles.wrappItem}>
            <View style={{width: '20%', justifyContent:'center'}}>
              <Text style={styles.label}>Loại</Text>
            </View>
            <View>
              <View style={{width: '80%', height: 35, flexDirection: 'row'}}>
                <RadioButton
                  value="1"
                  status={checked === '1' ? 'checked' : 'unchecked'}
                  onPress={() => setChecked('1')}
                />
                <Text style={styles.labelRadioBtn}>Công nghệ</Text>

                <RadioButton
                  value="2"
                  status={checked === '2' ? 'checked' : 'unchecked'}
                  onPress={() => setChecked('2')}
                />
                <Text style={styles.labelRadioBtn}>Thời trang</Text>

                <RadioButton
                  value="3"
                  status={checked === '3' ? 'checked' : 'unchecked'}
                  onPress={() => setChecked('3')}
                />
                <Text style={styles.labelRadioBtn}>Đồ chơi</Text>
              </View>
            </View>
          </View>

          <View style={styles.wrappItem}>
            <View style={{width: '30%', justifyContent:'center'}}>
              <Text style={styles.label}>Giá sản phẩm</Text>
            </View>
            <View style={{width: '70%', height: 35}}>
              <TextInput style={{width: 250, borderWidth: 1, borderRadius: 10, backgroundColor:'#ffff'}} 
                autoCapitalize="none"
                onChangeText={handleChange('price')}
                onBlur={handleBlur('price')}
                value={values.price}
              />
            </View>
          </View>

          {errors.price && touched.price && (
              <View style={{width: '100%', flexDirection:'row'}}>
                <View style={{width: '30%'}}></View>
                <View style={{width: '70%'}}>
                  <Text style={styles.text_err}>{errors.price}</Text> 
                </View>
              </View>
            )}

          <View style={styles.wrappItem}>
            <View style={{width: '30%',justifyContent:'center'}}>
              <Text style={styles.label}>Màu sắc</Text>
            </View>
            <View style={{width: '70%', height: 36}}>
              <TextInput style={{width: 250, borderWidth: 1, borderRadius: 10, backgroundColor:'#ffff'}} placeholder='Đỏ , Xanh, Vàng ...' 
                autoCapitalize="none"
                onChangeText={handleChange('color')}
                onBlur={handleBlur('color')}
                value={values.color}
              />
            </View>
          </View>

          {errors.color && touched.color && (
              <View style={{width: '100%', flexDirection:'row'}}>
                <View style={{width: '30%'}}></View>
                <View style={{width: '70%'}}>
                  <Text style={styles.text_err}>{errors.color}</Text> 
                </View>
              </View>
            )}

                {/* Mô tả sản phẩm */}
          <View style={[styles.wrappItem,{marginLeft: 5}]}>
            <View style={{width: '50%'}}>
              <Text style={styles.label}>Mô tả sản phẩm</Text>
            </View>
          </View>
          <View style={{width: '100%',alignItems:'center', justifyContent:'center' }}>
                <View
                    style={{
                    width: '95%',
                    borderWidth: 1,
                    borderRadius: 10,
                  }}>
                <Textarea
                  containerStyle={{
                  height: 150,
                  padding: 5,
                  backgroundColor: '#F5FCFF',
                  borderRadius: 10,
                  }}
                  style={styles.textarea}
                  //onChangeText={text => setInfo(text)}
                  //value={info}
                  maxLength={300}
                  placeholderTextColor={'#c7c7c7'}
                  underlineColorAndroid={'transparent'}
                  autoCapitalize="none"
                  onChangeText={handleChange('info')}
                  onBlur={handleBlur('info')}
                  value={values.info}
                />
              </View>
            </View>
          
            {errors.info && touched.info && (
              <View style={{width: '100%', flexDirection:'row'}}>
                <View style={{width: '30%'}}></View>
                <View style={{width: '70%'}}>
                  <Text style={styles.text_err}>{errors.info}</Text> 
                </View>
              </View>
            )}
          
          {/*Size */}
          {checked == '2' ? (
            <View style={styles.wrappItem}>
              <View style={{width: '30%'}}>
                <Text style={styles.label}>Kích cỡ</Text>
              </View>

              <View style={{width: '70%', height: 35, flexDirection:'row'}}>
                <Checkbox
                    status={sizeM ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setSizeMChecked(!sizeM);
                    }}
                  />
                  <Text style={styles.checkbox}>M</Text>
                  <Checkbox
                    status={sizeL ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setSizeLChecked(!sizeL);
                    }}
                  />
                  <Text style={styles.checkbox}>L</Text>
                  <Checkbox
                    status={sizeXL ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setSizeXLChecked(!sizeXL);
                    }}
                  />
                  <Text style={styles.checkbox}>XL</Text>
                  <Checkbox
                    status={sizeXXL ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setSizeXXLChecked(!sizeXXL);
                    }}
                  />
                  <Text style={styles.checkbox}>XXL</Text>
              </View>
            </View>
          ) : null}

          {/*Ảnh sản phẩm*/}

          <View style={styles.wrappUpload}>
            <Text style={{textAlign: 'center', fontSize: 17, fontWeight: '700', marginTop: 10}}>Ảnh sản phẩm </Text>
            <Text style={{fontSize: 14, fontStyle:'italic', textDecorationLine:'underline', textAlign:'center'}}>(Tối đa 6 ảnh)</Text>
              <View style={{marginTop: 10,}}>
                {/** <ViewPhoto/>*/}
              {  (listIMG.length === 0) &&
                <TouchableNativeFeedback onPress={choosePhotoFromLibrary}>
                  <View
                    style={{
                      width: '25%',
                      height: 95,
                      marginLeft: 20,
                      marginTop: 10,
                      borderWidth: 1,
                      borderColor: '#000000AA',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 20,
                      backgroundColor: '#ffff'
                    }}>
                    <Icon name='camera' size={28} color='black'/>
                  </View>
                </TouchableNativeFeedback>
                }

              {  (listIMG.length >= 1 && listIMG.length <= 5) &&
              <View
                style={{
                  flexDirection: 'row',
                  height: '90%',
                  flexWrap: 'wrap',
                }}>
                {listIMG.map((e, index) => (
                  <View
                    style={styles.wrappIMG} key={index}>
                    <Image
                      source={{uri: e}}
                      style={{width:'100%', height: '100%', resizeMode: 'cover'}}
                      key={index}
                    />
                    <TouchableNativeFeedback onPress={()=>onDelete(e)}>
                    <Image
                      style={{
                        position: 'absolute',
                        width: 20,
                        height: 25,
                        marginLeft: '78%',
                        marginTop: 5,
                      }}
                      source={deleteIcon}
                    /></TouchableNativeFeedback>
                  </View>
                ))}
                <TouchableNativeFeedback onPress={choosePhotoFromLibrary}>
                  <View
                  style={{
                    width: '25%',
                    height: 95,
                    marginLeft: 15,
                    marginTop: 10,
                    borderWidth: 1,
                    borderColor: '#000000AA',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 20,
                    backgroundColor: '#ffff'
                  }}>
                  <Icon name='camera' size={28} color='black'/>
                </View>
              </TouchableNativeFeedback>
              </View>
              }

            {  (listIMG.length == 6) &&
              <View
                style={{
                  flexDirection: 'row',
                  height: '90%',
                  flexWrap: 'wrap',
                }}>
                {listIMG.map((e, index) => (
                  <View
                    style={styles.wrappIMG} key={e}>
                    <Image
                      source={{uri: e}}
                      style={{width:'100%', height: '100%', resizeMode: 'cover'}}
                      key={index}
                    />
                    <TouchableNativeFeedback onPress={()=>onDelete(e)}>
                    <Image
                      style={{
                        position: 'absolute',
                        width: 20,
                        height: 25,
                        marginLeft: '78%',
                        marginTop: 5,
                      }}
                      source={deleteIcon}
                    /></TouchableNativeFeedback>
                  </View>
                ))}
              </View>
            }

            { (listIMG.length > 6) && (Alert.alert('Thông báo!','Chỉ chọn tối đa 6 ảnh.'))}

            </View>
          </View>

          {/*Màu sắc */}

        </View>
        </ScrollView>
        
      </View>
      

      <View style={{flex: 0.6}}>
        <View style={styles.wrappButton}>
          <View style={{width: '50%', height: 35, alignItems: 'center'}}>
            <View style={{width: '90%'}}>
              <Button title="Nhập mới"/>
            </View>
          </View>

          <View style={{width: '50%', height: 35, alignItems: 'center'}}>
            <View style={{width: '90%'}}>
              <Button title="Lưu" disabled={!isValid} onPress={submitImg}/>
            </View>
          </View>
        </View>
      </View>
      </View>
      )}
        </Formik>
    </SafeAreaView>
  );
};

export default AddProduct;

const styles = StyleSheet.create({
  wrappItem: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 7,
  },
  wrappUpload: {
    width: '100%',
  },
  wrappButton: {
    flexDirection: 'row',
    //backgroundColor:'green'
  },
  label: {
    fontSize: 15,
    marginLeft: 5,
    textAlign: 'left',
    fontWeight: '700',
  },
  wrappListIMG: {
    top: 2,
  },
  imageThumbnail: {
    height: '100%',
    width: '100%',
  },
  wrappIMG: {
    //flex: 1,
    backgroundColor: '#fff',
    padding: 2,
    marginVertical: 2,
    marginHorizontal: 5,
    width: '31.2%',
    height: 105,
    borderRadius: 5,
    borderColor:'#009387',
    borderWidth: 1,
    marginLeft: '0.8%',
    //position:'relative'
  },
  labelRadioBtn: {
    justifyContent:'center',
    marginTop: 7
  },
  checkbox: {
    fontSize: 17,
    marginTop: 7,
  },
  text_err: {
    color:'red',
    fontSize: 13,
  }
});
