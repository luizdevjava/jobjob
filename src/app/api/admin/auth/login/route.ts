import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'seu-secret-aqui'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    const admin = await db.admin.findUnique({
      where: { email }
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Em produção, usar bcrypt para comparar hashes
    if (admin.password !== password) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    const token = jwt.sign(
      { 
        id: admin.id, 
        email: admin.email 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return NextResponse.json({
      message: 'Login realizado com sucesso',
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name
      }
    })

  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}