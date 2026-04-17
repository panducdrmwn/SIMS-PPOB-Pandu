import React, { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../features/authSlice'
import { clearUser, setUser } from '../features/userSlice'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import defaultProfilePhoto from '../assets/Profile Photo.png'

export default function Account() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state => state.user.profile)
  const token = useSelector(state => state.auth.token)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
  })
  const [errors, setErrors] = useState({})
  const [uploadingImage, setUploadingImage] = useState(false)
  const [previewImage, setPreviewImage] = useState(user?.profile_image === "https://minio.nutech-integrasi.com/take-home-test/null" ? defaultProfilePhoto : user?.profile_image)
  const fileInputRef = useRef(null)

  const validateForm = () => {
    const nextErrors = {}

    if (!formData.first_name.trim()) {
      nextErrors.first_name = 'First name is required'
    }
    if (!formData.last_name.trim()) {
      nextErrors.last_name = 'Last name is required'
    }
    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Enter a valid email address'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearUser())
    navigate('/login')
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handlePictureClick = () => {
    fileInputRef.current?.click()
  }

  const handleProfileImageChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 100 * 1024) {
      toast.error('Image must be 100KB or less')
      event.target.value = ''
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreviewImage(objectUrl)

    setUploadingImage(true)
    const formDataImage = new FormData()
    formDataImage.append('image', file)

    try {
      const response = await axios.put('https://take-home-test-api.nutech-integrasi.com/profile/image', formDataImage, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.status === 0) {
        const updatedUser = response.data.data || {}
        if (updatedUser.profile_image) {
          setPreviewImage(updatedUser.profile_image)
          dispatch(setUser({ ...user, profile_image: updatedUser.profile_image }))
        }
        toast.success(response.data.message || 'Profile image updated')
      } else {
        toast.error(response.data.message || 'Failed to upload image')
      }
    } catch (error) {
      console.error(error)
      toast.error('Unable to upload profile image')
    } finally {
      setUploadingImage(false)
      event.target.value = ''
      URL.revokeObjectURL(objectUrl)
    }
  }

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix the highlighted fields')
      return
    }

    try {
      const response = await axios.put('https://take-home-test-api.nutech-integrasi.com/profile/update', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data.status === 0) {
        dispatch(setUser(response.data.data || formData))
        toast.success('Profile updated successfully')
        setIsEditing(false)
      } else {
        toast.error(response.data.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error(error)
      toast.error('Unable to save profile')
    }
  }

  const handleCancel = () => {
    setFormData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
    })
    setErrors({})
    setIsEditing(false)
  }

  const handleChange = (field) => (event) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  return (
    <div className="min-h-screen max-w-[80%] mx-auto">
      <div className=" p-6">
        <div className="flex flex-col items-center text-center mb-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleProfileImageChange}
          />
          <div className="relative">
            <img
              src={previewImage}
              alt="Profile"
              className="w-28 h-28 rounded-full mb-4 cursor-pointer object-cover"
              onClick={handlePictureClick}
            />
            <div className="absolute inset-x-0 bottom-0 pb-1 text-xs text-white bg-black bg-opacity-50 rounded-b w-full">
              {uploadingImage ? 'Uploading...' : 'Click to change'}
            </div>
          </div>
          <h1 className="text-2xl mt-4 font-bold">{user?.first_name} {user?.last_name}</h1>
        </div>

        <div className="space-y-4 mx-auto w-3/4">
           <div>
            <label className="block mb-4 text-sm font-medium text-gray-700">Email</label>
            <input
              value={formData.email}
              onChange={handleChange('email')}
              className={` p-3 w-full border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              disabled={!isEditing}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label className="block mb-4 text-sm font-medium text-gray-700">First Name</label>
            <input
              value={formData.first_name}
              onChange={handleChange('first_name')}
              className={` p-3 w-full border rounded-md ${errors.first_name ? 'border-red-500' : 'border-gray-300'}`}
              disabled={!isEditing}
            />
            {errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>}
          </div>
          <div>
            <label className="block mb-4 text-sm font-medium text-gray-700">Last Name</label>
            <input
              value={formData.last_name}
              onChange={handleChange('last_name')}
              className={` p-3 w-full border rounded-md ${errors.last_name ? 'border-red-500' : 'border-gray-300'}`}
              disabled={!isEditing}
            />
            {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>}
          </div>
         
        </div>

        <div className="mt-6 flex flex-col justify-end gap-3 mx-auto w-3/4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="rounded bg-red-600 px-5 py-3 text-white hover:bg-red-700"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="rounded border border-gray-300 bg-white px-5 py-3 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="rounded bg-red-600 px-5 py-3 text-white hover:bg-red-700"
            >
              Edit Profil
            </button>
          )}
          {!isEditing && (
            <button
              onClick={handleLogout}
              className="rounded border border-red-500 px-5 py-3 text-red-600 hover:bg-red-200"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
