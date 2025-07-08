import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Tag } from 'lucide-react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import toast from 'react-hot-toast'

interface Tag {
  id: string
  name: string
  color: string
  _count?: {
    influencers: number
  }
}

interface FormData {
  name: string
  color: string
}

const Tags = () => {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>()

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/tags`)
      setTags(response.data)
    } catch (error) {
      toast.error('Erro ao carregar tags')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      if (editingTag) {
        await axios.put(`/api/tags/${editingTag.id}`, data)
        toast.success('Tag atualizada com sucesso!')
      } else {
        await axios.post('/api/tags', data)
        toast.success('Tag criada com sucesso!')
      }
      
      fetchTags()
      reset()
      setShowForm(false)
      setEditingTag(null)
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao salvar tag')
    }
  }

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag)
    setValue('name', tag.name)
    setValue('color', tag.color)
    setShowForm(true)
  }

  const handleDelete = async (tagId: string) => {
    if (!confirm('Tem certeza que deseja deletar esta tag?')) return

    try {
      await axios.delete(`/api/tags/${tagId}`)
      toast.success('Tag deletada com sucesso!')
      fetchTags()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao deletar tag')
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingTag(null)
    reset()
  }

  const predefinedColors = [
    '#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b',
    '#ef4444', '#f97316', '#84cc16', '#06b6d4', '#8b5cf6'
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gerenciar Tags
          </h1>
          <p className="text-gray-600">
            Crie e gerencie categorias para organizar as influenciadoras
          </p>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Nova Tag
        </button>
      </div>

      {/* Formulário */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingTag ? 'Editar Tag' : 'Nova Tag'}
          </h3>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Tag
              </label>
              <input
                type="text"
                placeholder="Ex: Beleza, Lifestyle, Moda..."
                {...register('name', { required: 'Nome é obrigatório' })}
                className="input-field"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  {...register('color', { required: 'Cor é obrigatória' })}
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <div className="flex gap-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setValue('color', color)}
                      className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              {errors.color && (
                <p className="text-red-500 text-sm mt-1">{errors.color.message}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button type="submit" className="btn-primary">
                {editingTag ? 'Atualizar' : 'Criar'} Tag
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Lista de Tags */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {tags.map((tag) => (
            <motion.div
              key={tag.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{tag.name}</h3>
                    <p className="text-sm text-gray-500">
                      {tag._count?.influencers || 0} influenciadoras
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(tag)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(tag.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {!loading && tags.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Tag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma tag criada
          </h3>
          <p className="text-gray-600">
            Crie sua primeira tag para começar a categorizar as influenciadoras
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

export default Tags 