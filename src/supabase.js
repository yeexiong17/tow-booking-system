import { createClient } from '@supabase/supabase-js'

const options = {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
    }
}

export const supabase = createClient({ supabaseUrl: process.env.REACT_APP_SUPABASE_URL, supabaseKey: process.env.REACT_APP_SUPABASE_ANON_KEY }, options)

// User Table

// Location Table
export const createNewLocation = async (locationData) => {

    const { booking_id, latitude, longitude } = locationData

    try {
        const { data, error } = await supabase
            .from('location')
            .insert({ booking_id, latitude, longitude })
            .select()

        if (error) {
            throw new Error(error)
        }

        return { success: true, data: data }
    } catch (error) {
        console.log('Error creating new location: ', error)

        return {
            success: false,
            message: 'Something went wrong'
        }
    }
}

export const getLocation = async () => {
    try {
        const { data, error } = await supabase
            .from('location')
            .select()
            .eq('booking_id', 1)

        if (error) {
            throw new Error(error)
        }

        return {
            success: true,
            data
        }

        console.log(data)
    } catch (error) {
        return {
            success: false,
            message: "An error has occured: " + error
        }
    }
} 