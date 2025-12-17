import { db } from './src/lib/db'

async function seed() {
  try {
    // Criar cidades
    const saoPaulo = await db.cidade.upsert({
      where: { nome: 'São Paulo' },
      update: {},
      create: {
        nome: 'São Paulo',
        estado: 'SP',
        ativa: true
      }
    })

    const rioDeJaneiro = await db.cidade.upsert({
      where: { nome: 'Rio de Janeiro' },
      update: {},
      create: {
        nome: 'Rio de Janeiro',
        estado: 'RJ',
        ativa: true
      }
    })

    const beloHorizonte = await db.cidade.upsert({
      where: { nome: 'Belo Horizonte' },
      update: {},
      create: {
        nome: 'Belo Horizonte',
        estado: 'MG',
        ativa: true
      }
    })

    // Criar admin
    const admin = await db.admin.upsert({
      where: { email: 'admin@acompanhantes.com' },
      update: {},
      create: {
        email: 'admin@acompanhantes.com',
        password: 'admin123', // Em produção, usar hash
        name: 'Administrador'
      }
    })

    // Criar configurações do site
    await db.configSite.upsert({
      where: { id: '1' },
      update: {},
      create: {
        nomeSite: 'Acompanhantes VIP',
        whatsappComercial: '5511999999999',
        telefoneComercial: '5511999999998',
        corPrimaria: '#8b5cf6',
        corSecundaria: '#ec4899',
        corDestaque: '#f59e0b',
        temaEscuro: false
      }
    })

    // Criar anúncios de exemplo para São Paulo
    const anuncio1 = await db.anuncio.create({
      data: {
        nomeArtistico: 'Isabella',
        idade: 25,
        descricao: 'Garota de programa elegante e sofisticada',
        whatsapp: '5511912345678',
        telefone: '5511912345679',
        cidadeId: saoPaulo.id,
        destaque: true,
        estrelas: 5,
        ativo: true
      }
    })

    const anuncio2 = await db.anuncio.create({
      data: {
        nomeArtistico: 'Mariana',
        idade: 23,
        descricao: 'Jovem e vibrante, pronta para te surpreender',
        whatsapp: '5511987654321',
        cidadeId: saoPaulo.id,
        destaque: true,
        estrelas: 4,
        ativo: true
      }
    })

    const anuncio3 = await db.anuncio.create({
      data: {
        nomeArtistico: 'Laura',
        idade: 28,
        descricao: 'Experiência e maturidade para momentos inesquecíveis',
        whatsapp: '5511955555555',
        cidadeId: saoPaulo.id,
        destaque: false,
        estrelas: 4,
        ativo: true
      }
    })

    const anuncio4 = await db.anuncio.create({
      data: {
        nomeArtistico: 'Sophie',
        idade: 22,
        descricao: 'Doçura e paixão em um só lugar',
        whatsapp: '5511944444444',
        cidadeId: saoPaulo.id,
        destaque: false,
        estrelas: 3,
        ativo: true
      }
    })

    const anuncio5 = await db.anuncio.create({
      data: {
        nomeArtistico: 'Camila',
        idade: 26,
        descricao: 'A companhia perfeita para qualquer ocasião',
        whatsapp: '5511933333333',
        cidadeId: saoPaulo.id,
        destaque: false,
        estrelas: 5,
        ativo: true
      }
    })

    const anuncio6 = await db.anuncio.create({
      data: {
        nomeArtistico: 'Bianca',
        idade: 24,
        descricao: 'Elegância e mistério te esperam',
        whatsapp: '5511922222222',
        cidadeId: saoPaulo.id,
        destaque: false,
        estrelas: 4,
        ativo: true
      }
    })

    // Criar anúncios para Rio de Janeiro
    const anuncio7 = await db.anuncio.create({
      data: {
        nomeArtistico: 'Carla',
        idade: 27,
        descricao: 'Carioca quente e pronta para tudo',
        whatsapp: '5521911111111',
        cidadeId: rioDeJaneiro.id,
        destaque: true,
        estrelas: 5,
        ativo: true
      }
    })

    const anuncio8 = await db.anuncio.create({
      data: {
        nomeArtistico: 'Fernanda',
        idade: 25,
        descricao: 'Sol e praia na companhia certa',
        whatsapp: '5521922222222',
        cidadeId: rioDeJaneiro.id,
        destaque: false,
        estrelas: 4,
        ativo: true
      }
    })

    // Adicionar fotos para os anúncios (usando placeholder)
    await db.foto.createMany({
      data: [
        // Fotos do anúncio 1
        { url: 'https://picsum.photos/400/600?random=1', principal: true, anuncioId: anuncio1.id },
        { url: 'https://picsum.photos/400/600?random=2', principal: false, anuncioId: anuncio1.id },
        
        // Fotos do anúncio 2
        { url: 'https://picsum.photos/400/600?random=3', principal: true, anuncioId: anuncio2.id },
        { url: 'https://picsum.photos/400/600?random=4', principal: false, anuncioId: anuncio2.id },
        
        // Fotos do anúncio 3
        { url: 'https://picsum.photos/400/600?random=5', principal: true, anuncioId: anuncio3.id },
        
        // Fotos do anúncio 4
        { url: 'https://picsum.photos/400/600?random=6', principal: true, anuncioId: anuncio4.id },
        
        // Fotos do anúncio 5
        { url: 'https://picsum.photos/400/600?random=7', principal: true, anuncioId: anuncio5.id },
        
        // Fotos do anúncio 6
        { url: 'https://picsum.photos/400/600?random=8', principal: true, anuncioId: anuncio6.id },
        
        // Fotos do anúncio 7
        { url: 'https://picsum.photos/400/600?random=9', principal: true, anuncioId: anuncio7.id },
        
        // Fotos do anúncio 8
        { url: 'https://picsum.photos/400/600?random=10', principal: true, anuncioId: anuncio8.id },
      ]
    })

    console.log('Dados de exemplo criados com sucesso!')
    console.log('Admin: admin@acompanhantes.com / admin123')
    
  } catch (error) {
    console.error('Erro ao criar dados de exemplo:', error)
  } finally {
    await db.$disconnect()
  }
}

seed()