import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Users, Instagram } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

interface Influencer {
  id: string
  username: string
  fullName: string
  profilePic?: string
  bio?: string
  followers: number
  tags: Tag[]
}

interface Tag {
  id: string
  name: string
  color: string
}

const Home = () => {
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('')

  useEffect(() => {
    fetchInfluencers()
    fetchTags()
  }, [])

  const fetchInfluencers = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (selectedTag) params.append('tag', selectedTag)
      
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/influencers?${params}`)
      setInfluencers(response.data)
    } catch (error) {
      toast.error('Erro ao carregar influenciadoras')
    } finally {
      setLoading(false)
    }
  }

  const fetchTags = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/tags`)
      setTags(response.data)
    } catch (error) {
      toast.error('Erro ao carregar tags')
    }
  }

  const formatFollowers = (followers: number) => {
    if (followers >= 1000000) {
      return `${(followers / 1000000).toFixed(1)}M`
    } else if (followers >= 1000) {
      return `${(followers / 1000).toFixed(1)}K`
    }
    return followers.toLocaleString()
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Base de Dados de Influenciadoras
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Descubra e gerencie influenciadoras que representam a diversidade e beleza do Brasil
        </p>
      </motion.div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar influenciadoras..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="input-field"
            >
              <option value="">Todas as categorias</option>
              {tags.map((tag) => (
                <option key={tag.id} value={tag.name}>
                  {tag.name}
                </option>
              ))}
            </select>
            
            <button
              onClick={fetchInfluencers}
              className="btn-primary flex items-center gap-2"
            >
              <Filter size={18} />
              Filtrar
            </button>
          </div>
        </div>
      </motion.div>

      {/* Lista de Influenciadoras */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {influencers.map((influencer) => (
            <motion.div
              key={influencer.id}
              variants={itemVariants}
              className="card hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start space-x-4">
                                 <img
                   src={influencer.profilePic || `https://via.placeholder.com/60/6366f1/ffffff?text=${influencer.username.charAt(0).toUpperCase()}`}
                   alt={influencer.fullName}
                   className="profile-pic"
                   onError={(e) => {
                     const target = e.target as HTMLImageElement;
                     target.src = `https://via.placeholder.com/60/6366f1/ffffff?text=${influencer.username.charAt(0).toUpperCase()}`;
                   }}
                 />
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {influencer.fullName}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Instagram size={14} />
                    @{influencer.username}
                  </p>
                  
                  {influencer.bio && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {influencer.bio}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm font-medium text-gray-900">
                      {formatFollowers(influencer.followers)} seguidores
                    </span>
                    
                    <div className="flex flex-wrap gap-1">
                      {influencer.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag.id}
                          className="tag text-xs"
                          style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                        >
                          {tag.name}
                        </span>
                      ))}
                      {influencer.tags.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{influencer.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {!loading && influencers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma influenciadora encontrada
          </h3>
          <p className="text-gray-600">
            Tente ajustar os filtros ou cadastre uma nova influenciadora
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default Home 