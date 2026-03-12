
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(15),
    password VARCHAR(255),
    role VARCHAR(10) CHECK (role IN ('ADMIN','USER')),
    device_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE flats (
    id SERIAL PRIMARY KEY,
    flat_number VARCHAR(20) UNIQUE NOT NULL,
    flat_type VARCHAR(10),
    owner_id INTEGER REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subscription_plans (
    id SERIAL PRIMARY KEY,
    flat_type VARCHAR(10),
    monthly_amount INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE monthly_records (
    id SERIAL PRIMARY KEY,
    flat_id INTEGER REFERENCES flats(id),
    month DATE NOT NULL,
    amount INTEGER NOT NULL,
    status VARCHAR(10) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(flat_id, month)
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    flat_id INTEGER REFERENCES flats(id),
    monthly_record_id INTEGER REFERENCES monthly_records(id) UNIQUE,
    amount INTEGER NOT NULL,
    payment_mode VARCHAR(20),
    transaction_id VARCHAR(100),
    receipt_url TEXT,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
