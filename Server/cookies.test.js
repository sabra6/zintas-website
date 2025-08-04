const request=require('supertest');
const app=require('./app');

describe('Sign up as a first-time user and then log out', ()=>{
    let cookie;

    it('Should set cookie after signing up', async()=>{
        const signupresponse=await request(app)
            .post('/signup')
            .send({firstname: 'Shane', lastname: 'Abraham', email: 'sabra@gmail.com', password: 'sdcsdcs', phonenumber: '847-648-3031'});

        console.log(signupresponse.headers);

        expect(signupresponse.headers['set-cookie']).toBeDefined();

        cookie=signupresponse.headers['set-cookie'];

    })
    
    it('Should clear cookie after logging out', async()=>{
        const logoutresponse=await request(app)
            .post('/logout')
            .set('Cookie', cookie);
        
        expect(logoutresponse.headers['set-cookie']).toBeDefined();
    })
})

describe('Login as a returning user and then log out', ()=>{
    let cookie;

    it('Should not set cookie due not being signed up', async()=>{
        const loginresponse=await request(app)
            .post('/login')
            .send({email: 'sabraham@gmail.com', password: 'sdgsdcs'})
        expect(loginresponse.headers['set-cookie']).not.toBeDefined();
        //cookie=loginresponse.headers['set-cookie'];
    })

    it('Should not set cookie due to invalid credentials', async()=>{
        const loginresponse=await request(app)
            .post('/login')
            .send({email: 'sabra@gmail.com', password: 'sdgsdcs'})
        expect(loginresponse.headers['set-cookie']).not.toBeDefined();
        //cookie=loginresponse.headers['set-cookie'];
    })

    it('Should set cookie after logging in', async()=>{
        const loginresponse=await request(app)
            .post('/login')
            .send({email: 'sabra@gmail.com', password: 'sdcsdcs'})
        expect(loginresponse.headers['set-cookie']).toBeDefined();
        cookie=loginresponse.headers['set-cookie'];
    })

    it('Should clear cookie after logging out', async()=>{
        const logoutresponse=await request(app)
            .post('/logout')
            .set('Cookie', cookie);
        expect(logoutresponse.headers['set-cookie']).toBeDefined();
    })
})

describe('Login as a manager and then log out', ()=>{
    let cookie;

    it('Should not set cookie due to invalid credentials', async()=>{
        const loginresponse=await request(app)
            .post('/login')
            .send({email: 'Zintasevents@gmail.com', password: 'sdgsdcs'})
        expect(loginresponse.headers['set-cookie']).not.toBeDefined();
        //cookie=loginresponse.headers['set-cookie'];
    })

    it('Should set cookie after logging in', async()=>{
        const loginresponse=await request(app)
            .post('/login')
            .send({email: 'Zintasevents@gmail.com', password: 'zei7845'})
        expect(loginresponse.headers['set-cookie']).toBeDefined();
        cookie=loginresponse.headers['set-cookie'];
    })

    it('Should clear cookie after logging out', async()=>{
        const logoutresponse=await request(app)
            .post('/logout')
            .set('Cookie', cookie);
        expect(logoutresponse.headers['set-cookie']).toBeDefined();
    })
})

describe('Login as a returning user and then delete account', ()=>{
    let cookie;
    it('Should set cookie after logging in', async()=>{
        const loginresponse=await request(app)
            .post('/login')
            .send({email: 'sabra@gmail.com', password: 'sdcsdcs'})
        expect(loginresponse.headers['set-cookie']).toBeDefined();
        cookie=loginresponse.headers['set-cookie'];
    })

    it('Should clear cookie after deleting account', async()=>{
        const deleteresponse=await request(app)
            .post('/deleteaccount')
            .set('Cookie', cookie);
        expect(deleteresponse.headers['set-cookie']).toBeDefined();
    })
})

describe('Sign up as a first-time user and then delete account', ()=>{
    let cookie;
    it('Should set cookie after signing up', async()=>{
        const signupresponse=await request(app)
            .post('/signup')
            .send({firstname: 'Shawn', lastname: 'Abraham', email: 'sabraham@gmail.com', password: 'sdcsdfs', phonenumber: '847-648-1068'});

        console.log(signupresponse.headers);

        expect(signupresponse.headers['set-cookie']).toBeDefined();

        cookie=signupresponse.headers['set-cookie'];

    })
    
    it('Should clear cookie after deleting account', async()=>{
        const logoutresponse=await request(app)
            .post('/deleteaccount')
            .set('Cookie', cookie);
        
        expect(logoutresponse.headers['set-cookie']).toBeDefined();
    })
})