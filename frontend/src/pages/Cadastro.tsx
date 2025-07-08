import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, User, Instagram, Users, Tag } from 'lucide-react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import toast from 'react-hot-toast'

interface InstagramData {
  fullName: string
  profilePic: string
  bio: string
  followers: number
}

interface Tag {
  id: string
  name: string
  color: string
}

interface FormData {
  username: string
  tags: string[]
}

const Cadastro = () => {
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [instagramData, setInstagramData] = useState<InstagramData | null>(null)
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>()
  const username = watch('username')

  // Buscar tags disponíveis
  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/tags`)
      setTags(response.data)
    } catch (error) {
      toast.error('Erro ao carregar tags')
    }
  }

  const searchInstagram = async () => {
    if (!username) {
      toast.error('Digite um username do Instagram')
      return
    }

    setSearching(true)
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/influencers/search-instagram`, {
        username: username.replace('@', '')
      })
      
      setInstagramData(response.data)
      setValue('username', username.replace('@', ''))
      toast.success('Dados do Instagram carregados!')
    } catch (error) {
      toast.error('Erro ao buscar dados do Instagram')
    } finally {
      setSearching(false)
    }
  }

  const onSubmit = async (data: FormData) => {
    if (!instagramData) {
      toast.error('Busque os dados do Instagram primeiro')
      return
    }

    setLoading(true)
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/influencers`, {
        username: data.username,
        tags: selectedTags
      })
      
      toast.success('Influenciadora cadastrada com sucesso!')
      setInstagramData(null)
      setSelectedTags([])
      setValue('username', '')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao cadastrar influenciadora')
    } finally {
      setLoading(false)
    }
  }

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Cadastrar Influenciadora
        </h1>
        <p className="text-gray-600">
          Busque dados do Instagram e adicione à nossa base de dados
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Busca do Instagram */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username do Instagram
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="@username"
                  {...register('username', { required: 'Username é obrigatório' })}
                  className="input-field pl-10"
                />
              </div>
              <button
                type="button"
                onClick={searchInstagram}
                disabled={searching || !username}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                <Search size={18} />
                {searching ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>

          {/* Dados do Instagram */}
          {instagramData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-primary-50 to-secondary-50 p-4 rounded-lg border border-primary-200"
            >
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User size={18} />
                Dados do Instagram
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <p className="text-gray-900">{instagramData.fullName}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Seguidores
                  </label>
                  <p className="text-gray-900">{instagramData.followers.toLocaleString()}</p>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <p className="text-gray-900">{instagramData.bio}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Seleção de Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tags/Categorias
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`tag transition-all duration-200 ${
                    selectedTags.includes(tag.id)
                      ? 'ring-2 ring-offset-2'
                      : 'hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: selectedTags.includes(tag.id) ? tag.color : `${tag.color}20`,
                    color: selectedTags.includes(tag.id) ? 'white' : tag.color
                  }}
                >
                  <Tag size={14} className="mr-1" />
                  {tag.name}
                </button>
              ))}
            </div>
            {tags.length === 0 && (
              <p className="text-gray-500 text-sm mt-2">
                Nenhuma tag disponível. Crie tags na seção "Tags" primeiro.
              </p>
            )}
          </div>

          {/* Botão de Cadastro */}
          <button
            type="submit"
            disabled={loading || !instagramData}
            className="w-full btn-primary disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Cadastrando...
              </>
            ) : (
              <>
                <Users size={18} />
                Cadastrar Influenciadora
              </>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  )
}

export default Cadastro 