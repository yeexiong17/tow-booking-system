import React, { useState } from 'react'
import CommonLayout from '../../components/CommonLayout'
import { Button, FileInput, Space, Stack, TextInput } from '@mantine/core'
import { useAuth } from '../../Context'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../supabase'
import { notifications } from '@mantine/notifications'

const NotVerified = () => {

    const { signOut, userData, toggle } = useAuth()
    const navigate = useNavigate()

    // Add state for form inputs
    const [fullName, setFullName] = useState('')
    const [vehiclePlate, setVehiclePlate] = useState('')
    const [vehicleModel, setVehicleModel] = useState('')
    const [identificationNumber, setIdentificationNumber] = useState('')
    const [identificationCardPhoto, setIdentificationCardPhoto] = useState(null)
    const [licensePhoto, setLicensePhoto] = useState(null)
    const [vehiclePhoto, setVehiclePhoto] = useState(null)
    const [facePhoto, setFacePhoto] = useState(null)
    const [phoneNumber, setPhoneNumber] = useState('')

    // Image Type: vehicle, license, identification
    const generateUniqueFilePath = (imageType) => {
        const shortUserId = userData.id.split("-")[0]
        const now = new Date().toLocaleString("en-GB", { timeZone: "Asia/Kuala_Lumpur", hour12: false })
            .replace(/[\/, ]/g, "")
            .replace(/:/g, "")

        return `${shortUserId}_${now}_${imageType}`
    }

    const uploadImageToSupabase = async (image, imageType) => {

        let uniqueFileName = generateUniqueFilePath(imageType)

        const { uploadData, uploadError } = await supabase
            .storage
            .from('bucket')
            .upload(`tow_driver_details_image/${userData.id}/${uniqueFileName}.jpg`, image, {
                cacheControl: '3600',
                upsert: false
            })

        if (uploadError) throw new Error(uploadError)

        const { data } = supabase.storage.from('bucket').getPublicUrl(`tow_driver_details_image/${userData.id}/${uniqueFileName}.jpg`)

        return data.publicUrl
    }


    const onSubmitForm = async () => {
        try {
            toggle()

            if (!fullName || !vehiclePlate || !vehicleModel || !identificationNumber ||
                !identificationCardPhoto || !licensePhoto || !vehiclePhoto || !facePhoto ||
                !phoneNumber) {
                throw new Error('Please fill in all required fields')
            }

            const identificationCardPhotoUrl = await uploadImageToSupabase(identificationCardPhoto, 'identification')
            const licensePhotoUrl = await uploadImageToSupabase(licensePhoto, 'license')
            const vehiclePhotoUrl = await uploadImageToSupabase(vehiclePhoto, 'vehicle')
            const facePhotoUrl = await uploadImageToSupabase(facePhoto, 'face')

            const { error } = await supabase
                .from('tow_driver_details')
                .insert({
                    user_id: userData.id,
                    vehicle_model: vehicleModel,
                    vehicle_plate: vehiclePlate,
                    identification_number: identificationNumber,
                    full_name: fullName,
                    identification_card_photo_url: identificationCardPhotoUrl,
                    vehicle_photo_url: vehiclePhotoUrl,
                    license_photo_url: licensePhotoUrl,
                    face_photo_url: facePhotoUrl,
                    email: userData.email,
                    phone: phoneNumber,
                    status: 'pending'
                })


            if (error) throw new Error(error.message)

            notifications.show({
                title: 'Application Submitted',
                message: 'Please wait for approval',
                className: 'w-5/6 ml-auto',
                position: 'top-right',
                color: 'green'
            })

            window.location.reload()
        } catch (error) {
            notifications.show({
                title: 'Application Submission Failed',
                message: error.message,
                className: 'w-5/6 ml-auto',
                position: 'top-right',
                color: 'red'
            })
        } finally {
            toggle()
        }
    }


    return (
        <CommonLayout navShouldShow={false}>
            <Stack>
                <p className='font-bold'>Please enter your details for verification</p>
            </Stack>
            <Space h={10} />

            <TextInput
                label="Enter your name"
                description="Eg: John Doe"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
            />
            <Space h={10} />

            <TextInput
                label="Enter your phone number"
                description="Eg: 60123456789"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Space h={10} />

            <TextInput
                label="Vehicle Plate"
                description="Eg: ABC1234"
                placeholder="Enter your vehicle plate"
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
            />
            <Space h={10} />

            <TextInput
                label="Enter your vehicle model"
                description="Eg: Toyota Vios"
                placeholder="Enter your vehicle model"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
            />
            <Space h={10} />

            <TextInput
                label="Enter your identification number"
                description="Eg: 040101148394"
                placeholder="Enter your identification number"
                value={identificationNumber}
                onChange={(e) => setIdentificationNumber(e.target.value)}
            />
            <Space h={10} />

            <FileInput
                label="Face Photo"
                description="Upload a clear photo of your face"
                placeholder="Upload a photo..."
                onChange={setFacePhoto}
            />
            <Space h={10} />

            <FileInput
                label="Identification Card Photo"
                description="Upload a photo of your identification card"
                placeholder="Upload a photo..."
                onChange={setIdentificationCardPhoto}
            />
            <Space h={10} />

            <FileInput
                label="License Card Photo"
                description="Upload a photo of your driving license"
                placeholder="Upload a photo..."
                onChange={setLicensePhoto}
            />
            <Space h={10} />

            <FileInput
                label="Vehicle Photo"
                description="Upload a photo of your vehicle"
                placeholder="Upload a photo..."
                onChange={setVehiclePhoto}
            />

            <Button size='md' onClick={() => onSubmitForm()} color="green" fullWidth mt="md" radius="md">Submit For Review</Button>

            <Space h={20} />
            <Button size='md' onClick={() => signOut()} color="red" fullWidth mt="md" radius="md">Log Out</Button>
        </CommonLayout>
    )
}

export default NotVerified
