import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import {Bars3CenterLeftIcon, MagnifyingGlassIcon} from 'react-native-heroicons/outline'
import { styles } from '../theme'
import TrendingMovies from '../components/TrendingMovies'
import MovieList from '../components/MovieList'
import { useNavigation } from '@react-navigation/native'
import Loading from '../components/Loading'
  import { fetchTopRatedMovies, fetchTrendingMovies, fetchUpcomingMovies } from '../api/moviedb'


const HomeScreen = () => {
    const [trending, setTrending] = useState([])
    const [upcoming, setUpcoming] = useState([])
    const [topRated, setTopRated] = useState([])
    const [loading, setLoading] = useState(true)
    const navigation= useNavigation();

    useEffect(() => {
      getTrendingMovies();
      getTopRatedMovies();
      getUpComingMovies();
    }, [])


    const getTrendingMovies = async () => {
      const data = await fetchTrendingMovies();
      if(data && data.results) setTrending(data.results)
      setLoading(false)
    }

    const getUpComingMovies = async () => {
      const data = await fetchUpcomingMovies();
      if(data && data.results) setUpcoming(data.results)
      setLoading(false)
    }

    const getTopRatedMovies = async () => {
      const data = await fetchTopRatedMovies();
      if(data && data.results) setTopRated(data.results)
      setLoading(false) 
    }
    



  return (
    <View style={tw`flex-1 bg-neutral-800`}>
     {/* search bar and logo */}
     <SafeAreaView style={tw`mb-3`}>
        <StatusBar style='light'/>
        <View style={tw`flex-row justify-between items-center mx-4`}>
            <Bars3CenterLeftIcon size="30" strokeWidth={2} color="white"/>
            <Text style={tw`text-white text-3xl font-bold`}>
                <Text style={styles.text}>M</Text>ovies
            </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Search")} >
            <MagnifyingGlassIcon size="30" strokeWidth={2} color="white"/>
        </TouchableOpacity>
        </View>
     </SafeAreaView>
     {
      loading ? (
        <Loading/>
      ) : (
     <ScrollView
     showsVerticalScrollIndicator={false}
     contentContainerStyle={{paddingBottom: 10}} >
        {/* trending movies data */}
      <TrendingMovies data={trending}/>

      {/* upcoming movie row */}
      <MovieList title="Upcoming" data={upcoming} /> 

        {/* TopRated movie row */}
        <MovieList title="TopRated" data={topRated} />
     </ScrollView>

      )
     }
    </View>
  )
}

export default HomeScreen

