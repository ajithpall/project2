//
// import 'package:http/http.dart' as http;
// class API {
//   static const baseurl = "http://192.168.136.108/API"; // last ip address of current fo cmd and put ipconfig to get ip address and put first then put the this class file name
//   static adduser(Map data) async {
//     var uri = uri.parse("${baseurl}adduser");
//     try {
//       final res = await http.post(uri.parse("uri"), body: data);
//       if (res.Statuscode == 200) {
//         var data = jsonDecode(res.body.toString());
//         print(data);
//       }
//       else {
//         print('failed to get response');
//       }
//     catch (e) {
//       debugprint(e.toSting());
//     }
//   }
//   }



import 'dart:convert';// convert the dart map to string json
import 'package:flutter/material.dart'; // For debugPrint
import 'package:http/http.dart' as http;//for http request and response

class API {
  // Base URL of the API
  static const String baseurl = "http://192.168.136.108/API/";

  // Function to add a user
  static Future<void> adduser(Map<String, String> data) async {
    var uri = Uri.parse("${baseurl}adduser"); // Complete API URL

    try {
      // Make POST request
      final res = await http.post(uri, body: data);

      // Check response status
      if (res.statusCode == 200) {
        var responseData = jsonDecode(res.body.toString());
        print(responseData);
      } else {
        print('Failed to get response. Status Code: ${res.statusCode}');
      }
    } catch (e) {
      // Handle exception
      debugPrint('Error: ${e.toString()}');
    }
  }
}