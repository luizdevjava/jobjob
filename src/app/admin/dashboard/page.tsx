'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Users, MapPin, Star, Settings, LogOut, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

interface Admin {
  id: string
  email: string
  name?: string
}

interface Anuncio {
  id: string
  nomeArtistico: string
  idade: number
  cidade: {
    nome: string
    estado: string
  }
  destaque: boolean
  estrelas: number
  ativo: boolean
  whatsapp: string
  telefone?: string
  fotos: {
    url: string
    principal: boolean
  }[]
}

interface Cidade {
  id: string
  nome: string
  estado: string
  ativa: boolean
}

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [anuncios, setAnuncios] = useState<Anuncio[]>([])
  const [cidades, setCidades] = useState<Cidade[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    verificarAuth()
    carregarDados()
  }, [])

  const verificarAuth = () => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }
    
    const email = localStorage.getItem('adminEmail')
    if (email) {
      setAdmin({ id: '', email, name: 'Administrador' })
    }
  }

  const carregarDados = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        router.push('/admin')
        return
      }

      const [anunciosRes, cidadesRes] = await Promise.all([
        fetch('/api/admin/anuncios', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch('/api/admin/cidades', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      ])

      if (anunciosRes.ok) {
        const anunciosData = await anunciosRes.json()
        setAnuncios(anunciosData)
      }

      if (cidadesRes.ok) {
        const cidadesData = await cidadesRes.json()
        setCidades(cidadesData)
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminEmail')
    router.push('/admin')
  }

  const toggleAnuncioStatus = async (id: string, ativo: boolean) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/anuncios/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ativo: !ativo }),
      })

      if (response.ok) {
        carregarDados()
      }
    } catch (error) {
      console.error('Erro ao atualizar anúncio:', error)
    }
  }

  const toggleCidadeStatus = async (id: string, ativa: boolean) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/cidades/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ativa: !ativa }),
      })

      if (response.ok) {
        carregarDados()
      }
    } catch (error) {
      console.error('Erro ao atualizar cidade:', error)
    }
  }

  const deleteAnuncio = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este anúncio?')) return

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/anuncios/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        carregarDados()
      }
    } catch (error) {
      console.error('Erro ao excluir anúncio:', error)
    }
  }

  const deleteCidade = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta cidade?')) return

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/cidades/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        carregarDados()
      }
    } catch (error) {
      console.error('Erro ao excluir cidade:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Painel Administrativo</h1>
              {admin && (
                <span className="text-sm text-muted-foreground">
                  Logado como: {admin.email}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/">Ver Site</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Anúncios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{anuncios.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Anúncios Ativos</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {anuncios.filter(a => a.ativo).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Destaques</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {anuncios.filter(a => a.destaque).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cidades</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cidades.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de Gerenciamento */}
        <Tabs defaultValue="anuncios" className="space-y-6">
          <TabsList>
            <TabsTrigger value="anuncios">Anúncios</TabsTrigger>
            <TabsTrigger value="cidades">Cidades</TabsTrigger>
            <TabsTrigger value="config">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="anuncios">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gerenciar Anúncios</CardTitle>
                    <CardDescription>
                      Visualize, edite e gerencie todos os anúncios
                    </CardDescription>
                  </div>
                  <Button asChild>
                    <Link href="/admin/anuncios/novo">
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Anúncio
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {anuncios.map((anuncio) => (
                    <div
                      key={anuncio.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        {anuncio.fotos.length > 0 && (
                          <img
                            src={anuncio.fotos[0].url}
                            alt={anuncio.nomeArtistico}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <h3 className="font-semibold">{anuncio.nomeArtistico}</h3>
                          <p className="text-sm text-muted-foreground">
                            {anuncio.idade} anos • {anuncio.cidade.nome} - {anuncio.cidade.estado}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={anuncio.ativo ? "default" : "secondary"}>
                              {anuncio.ativo ? "Ativo" : "Inativo"}
                            </Badge>
                            {anuncio.destaque && (
                              <Badge variant="secondary">Destaque</Badge>
                            )}
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < anuncio.estrelas
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleAnuncioStatus(anuncio.id, anuncio.ativo)}
                        >
                          {anuncio.ativo ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/anuncios/${anuncio.id}/editar`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteAnuncio(anuncio.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cidades">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gerenciar Cidades</CardTitle>
                    <CardDescription>
                      Adicione, edite e gerencie as cidades disponíveis
                    </CardDescription>
                  </div>
                  <Button asChild>
                    <Link href="/admin/cidades/nova">
                      <Plus className="w-4 h-4 mr-2" />
                      Nova Cidade
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cidades.map((cidade) => (
                    <div
                      key={cidade.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-semibold">{cidade.nome}</h3>
                        <p className="text-sm text-muted-foreground">{cidade.estado}</p>
                        <Badge variant={cidade.ativa ? "default" : "secondary"} className="mt-1">
                          {cidade.ativa ? "Ativa" : "Inativa"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleCidadeStatus(cidade.id, cidade.ativa)}
                        >
                          {cidade.ativa ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/cidades/${cidade.id}/editar`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteCidade(cidade.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="config">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Site</CardTitle>
                <CardDescription>
                  Personalize as configurações gerais do site
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Settings className="w-12 h-12 mx-auto mb-4" />
                  <p>Configurações em desenvolvimento...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}