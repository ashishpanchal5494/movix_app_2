import { View, Text, Dimensions, ScrollView, TouchableOpacity, Image} from 'react-native'
import React, { useEffect } from 'react'
import tw from 'twrnc'
import { ChevronLeftIcon } from 'react-native-heroicons/outline'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeartIcon } from 'react-native-heroicons/solid'
import MovieList from '../components/MovieList'
import Loading from '../components/Loading'
import { fallbackPersonImage, fetchPersonDetails, fetchPersonMovies, image342 } from '../api/moviedb'


var {width, height} = Dimensions.get('window')
export default function PersonScreen() {
    const {params: item} = useRoute()
    const [personMovies, setPersonMovies] = useState([])
    const [isFavorite, toggleFavorite] = useState(false)
    const [loading, setLoading] = useState(false)
    const [person, setPerson] = useState({})
    const navigation = useNavigation();

    useEffect(() => {
        setLoading(true);
        console.log(item)
        getPersonDetails(item.id)
        getPersonMovies(item.id)
    }, [item])

    const getPersonDetails = async id => {
        const data = await fetchPersonDetails(id);
        if(data) setPerson(data)
        setLoading(false);
    }

    const getPersonMovies = async id => {
        const data = await fetchPersonMovies(id);
        console.log(data);
        if(data && data.cast) setPersonMovies(data.cast)
    }
  return (
   <ScrollView style={tw`flex-1 bg-neutral-900`} contentContainerStyle={{paddingBottom: 20}}>
    {/* back button */}
    <SafeAreaView style={tw`absolute z-20 w-full flex-row justify-between items-center px-4`}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ 
                backgroundColor: '#eab308',
                borderRadius: 10,
                padding: 10
            }}>
                <ChevronLeftIcon size="28" strokeWidth={2.5} color="white"/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleFavorite(!isFavorite)}>
                <HeartIcon size="35" color={isFavorite ? "red" : "white"}/>
            </TouchableOpacity>
        </SafeAreaView>


        {/* person details */}

        {
            loading ? (<Loading/>
            ) : (

        <View>
            <View style={{
                 flexDirection: 'row', // Equivalent to Tailwind CSS class 'flex-row'
                 justifyContent: 'center', 
                 marginTop: 150,
                shadowColor: 'gray',
                shadowRadius: 40,
                shadowOpacity: {width: 0, height: 5},
                shadowOpacity: 1
            }}>


                <View style={tw`items-center rounded-full overflow-hidden h-72 w-72 border border-neutral-500`}>
                <Image
                source={{ uri: image342(person?.profile_path || fallbackPersonImage)}}
                style={{
                    height: height*0.43, width: width*0.74
                }}
                />

                </View>
            </View>
            <View style={tw`mt-6`}>
                <Text style={tw`text-3xl text-white font-bold text-center`}>
                    {
                        person?.name
                    }
                </Text>
                <Text style={tw`text-base text-neutral-500 text-center`}>
                    {
                        person?.place_of_birth
                    }
                </Text>
            </View>
            <View style={tw`mx-3 mt-6 p-4 flex-row justify-between items-center bg-neutral-700 rounded-full`}>
                <View style={tw`border-r-2 border-r-neutral-400 px-2 items-center`}>
                    <Text style={tw`text-white font-semibold`}>Gender</Text>
                    <Text style={tw`text-neutral-300 text-sm`}>{person?.gender==1? "Female" : "Male"}</Text>
                </View>
                <View style={tw`border-r-2 border-r-neutral-400 px-2 items-center`}>
                    <Text style={tw`text-white font-semibold`}>Birthday</Text>
                    <Text style={tw`text-neutral-300 text-sm`}>{person?.birthday}</Text>
                </View>
                <View style={tw`border-r-2 border-r-neutral-400 px-2 items-center`}>
                    <Text style={tw`text-white font-semibold`}>Known for</Text>
                    <Text style={tw`text-neutral-300 text-sm`}>{person?.known_for_department}</Text>
                </View>
                <View style={tw` border-r-neutral-400 px-2 items-center`}>
                    <Text style={tw`text-white font-semibold`}>Popularity</Text>
                    <Text style={tw`text-neutral-300 text-sm`}>{person?.popularity?.toFixed(2) } %</Text>
                </View>
            </View>
            <View style={tw`my-6 mx-4 `}>
                <Text style={tw`text-white text-lg mb-5`}>Biography</Text>
                <Text style={tw`text-neutral-400 tracking-wide`}>
               {person?.biography || "N/ A"}
                </Text>
            </View>

            {/* Movies */}
            <MovieList title="Movies" hideSeeAll={true} data={personMovies}/>
        </View>
            )
        }
   </ScrollView>
  )
}

