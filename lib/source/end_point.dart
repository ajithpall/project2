import 'package:flutter/material.dart';
class ApiEndPoints{
  static final String baseurl = 'http://localhost:3001/API/adduser'; // Base URL holds the data of the URL of endpoint
  static _AuthEndPoints authEndPoints = _AuthEndPoints();// static mean we can call the feild or function inside the class without creating a instance
}
class _AuthEndPoints {
  final String resgisterEmail = '/adduser';
  final String loginEmail = "/adduser";
}