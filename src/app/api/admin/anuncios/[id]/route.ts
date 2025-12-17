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
    const { ativo, destaque, estrelas } = await request.json()
    const id = params.id

    const updateData: any = {}
    if (ativo !== undefined) updateData.ativo = ativo
    if (destaque !== undefined) updateData.destaque = destaque
    if (estrelas !== undefined) updateData.estrelas = estrelas

    const anuncio = await db.anuncio.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(anuncio)
  } catch (error) {
    console.error('Erro ao atualizar anúncio:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar anúncio' },
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

    // Primeiro deletar as fotos
    await db.foto.deleteMany({
      where: { anuncioId: id }
    })

    // Depois deletar o anúncio
    await db.anuncio.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Anúncio excluído com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir anúncio:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir anúncio' },
      { status: 500 }
    )
  }
}