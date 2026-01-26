import sql from "../config/db.js";

export const signup = async (req, res) => {
    try {
        const { id, name, email, password } = req.body;

        // Basic check if user exists
        const existingUsers = await sql`SELECT * FROM users WHERE email = ${email}`;
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        const [newUser] = await sql`
            INSERT INTO users (id, name, email, password)
            VALUES (${id}, ${name}, ${email}, ${password})
            RETURNING id, name, email
        `;

        res.status(201).json(newUser);
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Error signing up" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [user] = await sql`SELECT * FROM users WHERE email = ${email}`;

        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        res.json({ id: user.id, name: user.name, email: user.email });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Error logging in" });
    }
};
