import { View, Text, Dimensions, TextInput, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Image } from 'react-native'
import React, { useCallback } from 'react'
import tw from 'twrnc'
import { SafeAreaView } from 'react-native-safe-area-context'
import { XMarkIcon } from 'react-native-heroicons/solid'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import Loading from '../components/Loading'
import { debounce } from 'lodash'
import { image185, searchMovies } from '../api/moviedb'


var {width, height} = Dimensions.get('window')

export default function SearchScreen() {
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const navigation = useNavigation()

    const handleSearch = value => {
        if(value && value.length>2){
            setLoading(true)
            searchMovies({
                query: value,
                include_adult: 'false',
                language: 'en-US',
                page: '1'
            }).then(data => {
                setLoading(false)
               if(data && data.results) setResults(data.results)
               console.log(data)
            })
        }else{
            setLoading(false)
            setResults([])
        }
    }

    const handleTextDebounce = useCallback(debounce(handleSearch, 400), [])
    
  return (
  <SafeAreaView style={tw`bg-neutral-800 flex-1`}>
    <View style={tw`mx-4 mb-3 flex-row justify-between items-center border border-neutral-500 rounded-full`}>
        <TextInput
        onChangeText={handleTextDebounce}
        placeholder='Search movies'
        placeholderTextColor={'lightgray'}
        style={tw`pb-1 pl-6 flex-1 text-base font-semibold text-white tracking-wider`}
        />
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`rounded-full bg-neutral-500 p-3 m-1`}>
            <XMarkIcon size="25" color="white"/>
        </TouchableOpacity>
    </View>
    {/* results */}
    <ScrollView showsVerticalScrollIndicator={false}
    contentContainerStyle={{paddingHorizontal: 15}}
    style={tw`mt-4`}
    >
        <Text style={tw`text-white font-semibold ml-1 mb-6`}>Results ({results.length})</Text>
        {
            loading ? (
                <Loading/>
            ) : (

        <View style={tw`flex-row justify-between flex-wrap`}>
            {
                results.map((item, index) => {
                    return (
                        <TouchableWithoutFeedback key={index}
                        onPress={() => navigation.push('Movie', item)}>
                            <View>
                                <Image
                                source={{uri: image185(item?.poster_path)}}
                                style={{
                                    width: width*0.44, height: height*0.3,
                                    borderRadius: 24
                                }}
                                />
                                <Text style={tw`text-neutral-400 ml-1 m-3`}>
                                    {
                                        item?.title.length>22 ? item?.title.slice(0, 22)+"" : item?.title
                                    }
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    )
                })
            }
        </View>
            )
        }
          
    </ScrollView>
  </SafeAreaView>
  )
}