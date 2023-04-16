import mongoose from 'mongoose';
import CryptoJS from 'crypto-js';
const { Schema } = mongoose;

const notificationSubscriptionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    subscription: {
      type: String,
      default: ''
    },
    subscriptionHash: {
      type: String,
    },
  },
  {
    timestamps: true
  }
);

const encryptWithAES = (text) => {
  const passphrase = '123';
  return CryptoJS.AES.encrypt(text, passphrase).toString();
};

const decryptWithAES = (ciphertext) => {
  const passphrase = '123';
  const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};

notificationSubscriptionSchema.methods.parseSubscription = function () {
  const subAsString = decryptWithAES(this.subscriptionHash)
  return JSON.parse(subAsString);
};

notificationSubscriptionSchema.methods.encryptSubscription = function () {
  this.subscriptionHash = encryptWithAES(this.subscription);
  delete this.subscription;
};

const NotificationSubscription = mongoose.model('NotificationSubscription', notificationSubscriptionSchema);

export default NotificationSubscription;
