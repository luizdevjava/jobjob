import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const cidades = await db.cidade.findMany({
      where: {
        ativa: true
      },
      orderBy: {
        nome: 'asc'
      }
    })

    return NextResponse.json(cidades)
  } catch (error) {
    console.error('Erro ao buscar cidades:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar cidades' },
      { status: 500 }
    )
  }
}