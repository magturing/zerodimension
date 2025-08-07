import mongoose from 'mongoose';

const { Schema } = mongoose;



// Define a schema for the blog post
const blogSchema = new Schema(
  {
    title: { 
        type: String, 
        required: true, 
        trim: true, 
        minLength: 3, 
        maxLength: 100 
    },
    content: 
    { 
        type: String, 
        required: [true,"Blog content is required"],
        minLength:[10,"atLeast 10 characters of content is required."]
    },
    excerpt: { 
        type: String, 
        maxLength: 300 
    }, // A short description of the post
    author: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: [true,"author of the blog is required"] 
    }, // Reference to the User model
    category: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Category',
        required:[true,"select the category of the blog"] 
    }], // Categories the post belongs to
    tags: [{ 
        type: String 
    }], // Tags for post searchability
    featuredImage: { 
        type: String 
    }, // URL to an image featured in the post
    media: [{ 
        type: String 
    }], // Array of media (images/videos) associated with the post
    status: { 
        type: String, 
        enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], 
        default: 'draft' 
    }, // Post status
    publishedAt: { 
        type: Date,
        default:Date.now
    }, // The date the post is published
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }, // The date the post was last updated
    viewCount: { 
        type: Number, 
        default: 0 
    }, // Number of views
    likes: { 
        type: Number, 
        default: 0 
    }, // Number of likes
    dislikes: { 
        type: Number, 
        default: 0 
    }, // Number of dislikes
    isDeleted: { 
        type: Boolean, 
        default: false 
    },
    approvedStatus:{
        type:String,
        enum:["APPROVED","REJECTED","PROCESSED"],
        default:"PROCESSED"
    },
    approvedBy: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    }, // Reference to the user who published the post -> admin users can public the post.
    lastViewed: { 
        type: Date,
        default:Date.now
    }, 
    allowComments: { 
        type: Boolean, 
        default: true 
    }, 
    allowSharing: { 
        type: Boolean, 
        default: true 
    }, 
    socialShares: { 
        type: Map, 
        of: Number, 
        default: { facebook: 0, twitter: 0, linkedin: 0 } 
    }, // Social media share counts
  },
  { timestamps: true }
);

// Add a method to update view count
blogSchema.methods.incrementViewCount = async function () {
  this.viewCount += 1;
  this.lastViewed = Date.now();
  await this.save();
};

// Add a method to update like count
blogSchema.methods.incrementLikes = async function () {
  this.likes += 1;
  await this.save();
};

// Add a method to update dislike count
blogSchema.methods.incrementDislikes = async function () {
  this.dislikes += 1;
  await this.save();
};

// Add a method to soft delete a blog post
blogSchema.methods.softDelete = async function () {
  this.isDeleted = true;
  await this.save();
};

// Virtual property for full content
blogSchema.virtual('fullContent').get(function () {
  return `${this.content}`;
});

// Add a pre-save hook to update updatedAt field
blogSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export const Blog = mongoose.model('Blog', blogSchema);

