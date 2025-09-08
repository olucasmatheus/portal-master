import swaggerAutogen from 'swagger-autogen';

const outputFile = './swagger.json';
const endpointsFiles = ['./src/routes/index.ts'];

const doc = {
    info: {
        title: 'Portal Ilha Conectada',
        version: '1.0.0',
        description:
            process.env.NODE_ENV === 'development'
                ? 'API do Portal Ilha Conectada. Atualmente está rodando em desenvolvimento'
                : 'API do Portal Ilha Conectada. Atualmente está rodando em produção',
    },
    host:
        process.env.NODE_ENV === 'development'
            ? 'localhost:3000'
            : 'localhost:8000',
    definitions: {
        createUser: {
            $name: 'João',
            $password: 'minhasenha123@',
            $email: 'joaosilva@gmail.com',
            $profile: 'user',
        },
        login: {
            $email: 'joaosilva@gmail.com',
            $password: 'minhasenha123@',
        },
        createEstagiario: {
            $name: 'João',
            $email: 'joaosilva@gmail.com',
            company: 'ABC Tech',
            $techStack: ['JS', 'Python'],
            $bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            $birth: '2004-01-17',
            $startDate: '2023-04-24',
            $endDate: '2025-04-24',
            $social: {
                linkedin: 'https://www.linkedin.com/in/joaosilva',
                github: 'https://github.com/joaosilva',
            },
        },
    },
};

swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
    console.log('Swagger docs gerado com sucesso!');
    import('../server/server');
});
