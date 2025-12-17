import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'seu-secret-aqui'

function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    return jwt.verify(token, JWT_SECRET) as any
  } catch {
    return null
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = verifyAuth(request)
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const { ativa } = await request.json()
    const id = params.id

    const cidade = await db.cidade.update({
      where: { id },
      data: { ativa }
    })

    return NextResponse.json(cidade)
  } catch (error) {
    console.error('Erro ao atualizar cidade:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar cidade' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = verifyAuth(request)
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const id = params.id

    // Verificar se há anúncios nesta cidade
    const anunciosCount = await db.anuncio.count({
      where: { cidadeId: id }
    })

    if (anunciosCount > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir uma cidade que possui anúncios' },
        { status: 400 }
      )
    }

    await db.cidade.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Cidade excluída com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir cidade:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir cidade' },
      { status: 500 }
    )
  }
}