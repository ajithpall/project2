import 'dart:convert'; // Convert the dart map to string json
import 'package:flutter/material.dart'; // For debugPrint
import 'package:http/http.dart' as http; // For http request and response

class API {
  // Base URL of the API
  static const String baseurl = "http://localhost:3001/API"; // Base URL holds the data of the URL of endpoint

  // Function to add a user
  static Future<void> adduser(Map<String, String> data) async {
    // The function accepts a Map<String, String> as the argument (data)
    // It performs an HTTP POST request to the API endpoint adduser using the http.post() method.
    // The body of the POST request is set to the provided data.
    var url = Uri.parse("${baseurl}/adduser"); // Uniform Resource Locator saved into the uri and Uri is class in dart Uri.parse , baseurl and adduser string interpolation /api + adduser the endpoint

    try {
      // Make POST request
      final res = await http.post(url,
          headers: {"Content-Type": "application/json"}, // Set the content-type to application/json
          body: jsonEncode(data)); // This makes the HTTP post request and encodes the data as JSON
print (data); 
print (jsonEncode(data));
      // Check response status
      // If the status code of the response is 200 (HTTP OK), it parses the response body into a Dart
      // object using jsonDecode() and prints it to the console.
      if (res.statusCode == 200) { // If HTTP response is 200 (success)
        var responseData = jsonDecode(res.body.toString()); // Decode the JSON response
        print(responseData); // Print the decoded response
      } else {
        print('Failed to get response. Status Code: ${res.statusCode}'); // Handle non-200 status codes
      }
    } catch (e) {
      // Handle exception
      debugPrint('Error: ${e.toString()}'); // Print error message if the request fails
    }
  }
}
