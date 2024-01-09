import { View, Text, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Image, Dimensions } from 'react-native'
import React from 'react'
import tw from 'twrnc'

import { useNavigation } from '@react-navigation/native'
import { fallbackMoviePoster, image185 } from '../api/moviedb'

var {width, height} = Dimensions.get('window')
export default function MovieList({title, data, hideSeeAll}) {
    const navigation = useNavigation();
  return (
    <View style={tw`mb-8 space-y-4`}>
     <View style={tw`mx-4 flex-row justify-between items-center`}>
        <Text style={tw`text-white text-xl mb-4`}>{title}</Text>
        {
            !hideSeeAll && (

        <TouchableOpacity>
            <Text style={{
                color: "#eab308",
                fontSize: "18px",
            }}  >See All</Text>
        </TouchableOpacity>
            )
        }
     </View>
     {/* movie row */}
     <ScrollView
     horizontal
     showsHorizontalScrollIndicator={false}
     contentContainerStyle={{paddingHorizontal: 15}}
     >
        {
            data.map((item, index) =>{
                return(
                    <TouchableWithoutFeedback 
                    key={index}
                    onPress={() => navigation.push('Movie', item)}
                    >
                        <View style={tw`space-y-1 mr-4`}>
                            <Image
                            source={{uri: image185(item.poster_path || fallbackMoviePoster) }}
                            style={{width: width*0.33, height: height*0.22,borderRadius: 25 }}
                            />
                        <Text style={tw`text-neutral-300 ml-1`}>{
                           item.title.length>14 ? item.title.slice(1, 14)+'...' : item.title
                        }</Text>
                        </View>
                    </TouchableWithoutFeedback>
                )
            })
        }
     </ScrollView>
    </View>
  )
}