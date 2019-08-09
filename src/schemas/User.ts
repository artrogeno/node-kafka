import { Schema, model, Document } from 'mongoose'
import { env } from 'process'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

interface UserInterface extends Document {
  email?: string,
  username?: string,
  password?: string,
  firstName?: string,
  lastName?: string,
  compareHash(password:string): boolean,
  generateToken(): object
}

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  username: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

UserSchema.pre('save', async function hasPassword (next): Promise<void> {
  if (!this.isModified('password')) {
    next()
  }
  this.password = await bcrypt.hash(this.password, 8)
})

UserSchema.methods = {
  compareHash: function (password) {
    return bcrypt.compareSync(password, this.password)
  },
  generateToken: function () {
    return jwt.sign({ id: this.id }, env.JWT_SECRET, {
      expiresIn: 86400
    })
  }
}

export default model<UserInterface>('User', UserSchema)
