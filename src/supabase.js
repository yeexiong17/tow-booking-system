import { createClient } from '@supabase/supabase-js'

const options = {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
    }
}

export const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY, options)
export const adminSupabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SERVICE_ROLE_KEY, options)

export const assignDriverToBooking = async (bookingId) => {
    try {
        // Find available tow drivers
        const { data: drivers, error: driverError } = await adminSupabase
            .from('profiles')
            .select('id')
            .eq('role', 'tow')
            .eq('status', 'active');

        if (driverError || !drivers || drivers.length === 0) {
            console.log('No available tow drivers');
            return { success: false, message: 'No available tow drivers' };
        }

        // Pick a random available driver
        const driver = drivers[Math.floor(Math.random() * drivers.length)];

        // Assign driver to booking
        const { error: bookingError } = await adminSupabase
            .from('bookings')
            .update({ tow_id: driver.id, status: 'In progress' })
            .eq('id', bookingId);

        if (bookingError) {
            throw new Error('Failed to update booking');
        }

        // Update driver status to 'working'
        const { error: updateError } = await adminSupabase
            .from('profiles')
            .update({ status: 'working' })
            .eq('id', driver.id);

        if (updateError) {
            throw new Error('Failed to update driver status');
        }

        console.log(`Driver ${driver.id} assigned successfully`);
        return { success: true };
    } catch (error) {
        console.log('Error assigning driver: ', error);
        return { success: false, message: error.message };
    }
};

export const updateUserLocation = async (userId, latitude, longitude) => {
    try {
        const { data, error } = await supabase
            .from('locations')
            .upsert(
                {
                    user_id: userId,
                    latitude: latitude,
                    longitude: longitude,
                    updated_at: new Date().toISOString()
                },
                { onConflict: 'user_id' }
            );

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error updating location:', error);
        return { success: false, error: error.message };
    }
};