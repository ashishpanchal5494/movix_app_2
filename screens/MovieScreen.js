import { View, Text, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import tw from 'twrnc'
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import {HeartIcon} from 'react-native-heroicons/solid';
import { LinearGradient } from 'expo-linear-gradient';
import Cast from '../components/Cast';
import MovieList from '../components/MovieList';
import Loading from '../components/Loading';
import { fetchMovieCredits, fetchMovieDetails, fetchSimilarMovies, image500 } from '../api/moviedb';

var {width, height} = Dimensions.get('window')

export default function MovieScreen() {
    const {params: item} = useRoute();
    const [isFavorite, toggleFavorite] = useState(false)
    const navigation = useNavigation();
    const [cast, setCast] = useState()
    const [similarMovies, setSimilarMovies] = useState([])
    const [loading, setLoading] = useState(false)
    const [movie, setMovie] = useState({})

    useEffect(() => {
        getMovieCredits(item.id)
        getMovieDetails(item.id)
        getSimilarMovies(item.id)
    }, [item])

    const getMovieDetails = async id => {
        const data = await fetchMovieDetails(id);
        if(data) setMovie(data)
    }

    const getMovieCredits = async id => {
        const data = await fetchMovieCredits(id);
        if(data && data.cast) setCast(data.cast) 
    }

    const getSimilarMovies = async id => {
        const data = await fetchSimilarMovies(id);
        if(data && data.results) setSimilarMovies(data.results)


    }

  return (
   <ScrollView
   contentContainerStyle={{paddingBottom: 20}}
   style={tw`flex: 1 bg-neutral-900`}
   >
    <View style={tw`w-full`}>
        <SafeAreaView style={tw`absolute z-20 w-full flex-row justify-between items-center px-4`}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{
                backgroundColor: '#eab308',
                borderRadius: 10,
                padding: 10
            }}>
                <ChevronLeftIcon size="28" strokeWidth={2.5} color="white"/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleFavorite(!isFavorite)}>
                <HeartIcon size="35" color={isFavorite ? "#eab308" : "white"}/>
            </TouchableOpacity>
        </SafeAreaView>
            {
                loading ? (
                    <Loading/>
                ) : (
                    
        <View>
        <Image
        source={{uri: image500(movie?.poster_path)}}
        style={{width, height: height*0.55}}
        />
        <LinearGradient colors={['transparent', 'rgba(23,23,23, 0.8)', 'rgba(23,23,23, 1)']}
        style={{width, height: height*0.40, position: "absolute", bottom: 0}}
        start={{x: 0.5, y: 0}}
        end={{x: 0.5, y:1}}
        />
        </View>
                )
            }
    </View>
    {/* movie detail */}
    <View style={{marginTop: -(height*0.09), }}  >
        

        {/* title */}
        <Text style={tw`text-white text-center text-3xl font-bold tracking-wider`}>
            
            {movie?.title}
            
        </Text>
        {/* status release runtime */}
        <Text style={tw`text-neutral-400 font-semibold text-base text-center m-2`}>
        {movie?.status} * {movie?.release_date?.split('_')[0]} * {movie?.runtime} min
        </Text>

        {/* genes */}
        <View style={tw`flex-row justify-center my-2 `}>
        {
            movie?.genres?.map((genre, index) => {
                let showDot = index+1 != movie.genres.length;
                return (
        <Text key={index} style={tw`text-neutral-400 font-semibold text-base text-center mx-2`}>
          {genre.name} {showDot? " *":null}
        </Text>
                )
            })
        }
        {/* <Text style={tw`text-neutral-400 font-semibold text-base text-center `}>
            Thrill *
        </Text>
        <Text style={tw`text-neutral-400 font-semibold text-base text-center mx-2`}>
            Comedy
        </Text> */}
        </View>
        {/* discription */}
        <Text style={tw`text-neutral-400 tracking-wide mx-4`}>
       {
        movie?.overview
       }
        </Text>
    </View>

    {/* cast */}
    <Cast cast={cast} navigation={navigation}/>

    {/* similar movies */}
    <MovieList title="Similar Movies" hideSeeAll={true} data={similarMovies} />
   </ScrollView>
  )
}