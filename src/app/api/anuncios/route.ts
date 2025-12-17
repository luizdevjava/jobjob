import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cidadeId = searchParams.get('cidadeId')

    if (!cidadeId) {
      return NextResponse.json(
        { error: 'ID da cidade é obrigatório' },
        { status: 400 }
      )
    }

    const anuncios = await db.anuncio.findMany({
      where: {
        cidadeId: cidadeId,
        ativo: true
      },
      include: {
        cidade: {
          select: {
            nome: true,
            estado: true
          }
        },
        fotos: {
          where: {
            principal: true
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: [
        { destaque: 'desc' },
        { estrelas: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    // Se não tiver foto principal, busca a primeira foto
    for (const anuncio of anuncios) {
      if (anuncio.fotos.length === 0) {
        const primeiraFoto = await db.foto.findFirst({
          where: {
            anuncioId: anuncio.id
          },
          orderBy: {
            createdAt: 'asc'
          }
        })
        
        if (primeiraFoto) {
          anuncio.fotos.push(primeiraFoto)
        }
      }
    }

    return NextResponse.json(anuncios)
  } catch (error) {
    console.error('Erro ao buscar anúncios:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar anúncios' },
      { status: 500 }
    )
  }
}