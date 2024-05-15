import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import { Link, SplashScreen, Stack, useRouter, useSegments } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import Colors from '@/constants/Colors'
import { StatusBar } from 'react-native'
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store"
import { useFonts } from 'expo-font'
// import Constants from "expo-constants"

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
// Cache the Clerk JWT
const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();


const InitialLayout = () => {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  
  const router = useRouter();
  // ! clerk gives this
  const { isLoaded, isSignedIn } = useAuth();

  const segments = useSegments()

  useEffect(() => {
    console.log('is singedIn', isSignedIn);
    if(!isLoaded) return;

    const inAuthGroup = segments[0]==='(authenticated)'

    if(isSignedIn && !inAuthGroup){
      router.replace('/(authenticated)/(tabs)/home')
    }else if(!isSignedIn){
      router.replace('/')
    }
  }, [isSignedIn])


  if (!loaded || !isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    )
  }


  return (
    <Stack>

      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="signup"
        options={{
          title: '',
          headerBackTitle: '',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Ionicons name="arrow-back" size={34} color={Colors.dark} />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="login"
        options={{
          title: '',
          headerBackTitle: '',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Ionicons name="arrow-back" size={34} color={Colors.dark} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <Link href={'/modal'} asChild>
              <TouchableOpacity>
                <Ionicons name="help-circle-outline" size={34} color={Colors.dark} />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <Stack.Screen name='modal' options={{ presentation: 'modal' }} />
      <Stack.Screen name='(authenticated)/(tabs)' options={{ headerShown:false }} />
    </Stack>
  )
}

const RootLayoutNav = () => {

  return (
    <>
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY!} tokenCache={tokenCache}>

        <InitialLayout />
      </ClerkProvider>
    </>
  )
}

export default RootLayoutNav