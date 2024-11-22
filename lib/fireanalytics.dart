import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:firebase_analytics/observer.dart';

FirebaseAnalytics analytics = FirebaseAnalytics.instance;
FirebaseAnalyticsObserver analyticsObserver =
FirebaseAnalyticsObserver(analytics: analytics);

