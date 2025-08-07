import mongoose,{Schema} from 'mongoose';

const categorySchema = new Schema(
  {
    name: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true, 
        maxLength: [100,"Category name can not be more than 100 characters long."],
        unique:[true,"Category name must be unique"]
    },
    description: { 
        type: String, 
        maxLength: [500,"Description of the category can not be more than 500 characters long."]
    }, 
    image: { 
        type: String,
        default:"https://myimage.com" 
    },  
    status: { 
        type: String, 
        enum: ['active', 'inactive'], 
        default: 'active' 
    }, 
    isDeleted:{
        type:Boolean,
        default:false,
    },
    createdBy: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required:true,
    }, 
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }, 
  },
  { timestamps: true }
);


categorySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});


export const Category = mongoose.model('Category', categorySchema);

