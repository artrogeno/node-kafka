import { Schema, model, Document } from 'mongoose'

interface RouteInterface extends Document {
  uri?: string,
  types?: string
}

const RouteSchema = new Schema({
  uri: {
    type: String,
    unique: true,
    required: true
  },
  types: {
    type: String,
    enum: ['PUBLIC', 'PRIVATE'],
    required: true
  }
})

export default model<RouteInterface>('Route', RouteSchema)
