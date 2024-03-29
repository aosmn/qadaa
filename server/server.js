import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.config.js';
import userRouter from './routes/user.routes.js';
import prayerRouter from './routes/prayer.routes.js';
import dayPrayerRouter from './routes/day.prayer.routes.js';
import prayerTimesRouter from './routes/prayerTimes.routes.js';
import fatwaRouter from './routes/fatwa.routes.js';
import notificationRouter from './routes/notification.routes.js';
import path from 'path';
import { notFound, errorHandler } from './middleware/error.middleware.js';
import cron from 'node-cron';
import NotificationSubscription from './models/subscription.model.js';
import webpush from 'web-push';

dotenv.config({
  path: `.env${process.env.NODE_ENV === 'production' ? '' : '.development'}`
});

const corsOptions = {
  origin: [process.env.CLIENT_URL, process.env.CLIENT],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

connectDB();

const app = express();
app.use(express.json());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use('/api/users', userRouter);
app.use('/api/fatwas', fatwaRouter);
app.use('/api/prayers/', prayerRouter);
app.use('/api/dayPrayers/', dayPrayerRouter);
app.use('/api/prayerTimes/', prayerTimesRouter);
app.use('/subscribe', notificationRouter);

const __dirname = path.resolve();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/build')));
  app.use(express.static(path.join(__dirname, '/server/public')));
  // app.get('/.well-known/acme-challenge/T4Ho2OuT53Vi2X9fCWGJEU4t7SN1vyik90usZPiJYro', (req, res) => {
  //   res.sendFile(path.resolve(__dirname, 'server', 'public', 'T4Ho2OuT53Vi2X9fCWGJEU4t7SN1vyik90usZPiJYro'));
  // });
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running');
  });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
const httpsPort = parseInt(PORT, 10) + 443;
// app.all('*', (req, res, next) => {
//   if (req.secure) {
//     req.next();
//   } else {
//     res.redirect(307, 'https://' + req.hostname +':' + httpsPort + req.url);
//   }
// })
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// every day at 10
cron.schedule('0 */12 * * *', async () => {
  console.log('cron job running', new Date());
  try {
    const subs = await NotificationSubscription.find({});
    subs.forEach(sub => {
      const subscription = sub.parseSubscription();
      const payload = JSON.stringify({
        title: 'Log your prayers!',
        body: 'Did you remember to log your prayers today?'
      });

      webpush.sendNotification(subscription, payload).catch(console.log);
    });
  } catch (error) {
    console.log(error);
  }
});

// const httpsOptions = {
//     cert: fs.readFileSync(
//         path.join(__dirname, 'server', 'bin', 'qadaa.aosmn.com.pem')
//     ),
//     key: fs.readFileSync(
//         path.join(__dirname, 'server', 'bin', 'qadaa.aosmn.com.key')
//     )
// };
// https
//   .createServer(httpsOptions, app)
//   .listen(
//     httpsPort,
//     console.log(
//       `HTTPS Server running in ${process.env.NODE_ENV} mode on port ${httpsPort}`
//         .blue.bold
//     )
//   );
