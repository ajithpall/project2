import 'package:flutter/material.dart';
import 'package:restpostapi/source/api_source.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';


void main() async {
  //ensuring that everything Flutter-related is ready to go.
  WidgetsFlutterBinding.ensureInitialized();
  //line initializes Firebase in your Flutter app.  connect to the backend setting up all the connection to firebase
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
      // Firebase, you'll need to provide the necessary Firebase options.
  );
    runApp(const apiapp());
}

class apiapp extends StatefulWidget {
  const apiapp({super.key});

  @override
  State<apiapp> createState() => apiappState();
}

class apiappState extends State<apiapp> {
  // Define controllers
  final TextEditingController nameController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController emailController = TextEditingController();

  @override
  void dispose() {
    // Dispose controllers to free up memory
    nameController.dispose();
    passwordController.dispose();
    emailController.dispose();
    super.dispose();
  }
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
          body:
          Container(
            height: MediaQuery
                .of(context)
                .size
                .height,
            width: MediaQuery
                .of(context)
                .size
                .width,
            color: Colors.lightBlue.shade600.withOpacity(0.5),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                SizedBox(
                  height: 50,
                  width: 400,
                  child: DecoratedBox(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(20.0),
                      color: Colors.white,
                    ),
                    child:  Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        const Padding(
                          padding: EdgeInsets.all(5),
                          child: Icon(
                            Icons.account_circle,
                            color: Colors.black,
                          ),
                        ),
                        Expanded(
                          child: TextField(
                            controller: nameController,
                            decoration: const InputDecoration(
                              hintText: 'text here ...',
                              border: InputBorder.none,
                              hintStyle: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.normal,
                                color: Colors.black,
                              ),
                            ),
                          ),
                        ),
                      ],

                    ),
                  ),
                ),
                const SizedBox(height: 10),
                //password box
                SizedBox(
                  height: 50,
                  width: 400,
                  child: DecoratedBox(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(20.0),
                      color: Colors.white,
                    ),
                    child:  Row (
                      mainAxisAlignment: MainAxisAlignment.start,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        const  Padding(
                          padding: EdgeInsets.all(5),
                          child: Icon(
                            Icons.visibility,
                          ),
                        ),
                        Expanded(
                          child: TextField(
                            controller: passwordController,
                            decoration: const InputDecoration(
                              hintText: "put password here ",
                              border: InputBorder.none,
                              hintStyle: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.normal,
                                color: Colors.black,

                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 9),
                //emailbox
                SizedBox(
                  height: 50,
                  width: 400,
                  child: DecoratedBox(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(20.0),
                      color: Colors.white,
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        const   Padding(
                          padding:EdgeInsets.all(5),
                          child: Icon(
                            Icons.email,
                          ),
                        ),
                        Expanded (
                          child: TextField (
                            controller: emailController,
                            decoration: const  InputDecoration(
                              hintText: 'put you email here',
                              border: InputBorder.none,
                              hintStyle: TextStyle (
                                fontSize: 10,
                                fontWeight:FontWeight.normal,
                                color: Colors.black,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox (height: 10),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue.shade800, // Button color
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(25), // Rounded corners
                    ),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 40, // Horizontal padding
                      vertical: 15, // Vertical padding
                    ),
                  ),
                  onPressed: (){
                    Map<String,String > userdata= {
                      'name' : nameController.text,
                      'password': passwordController.text,
                      'email': emailController.text
                    };
                    API.adduser(userdata);// send the data to the API.adduser( userdata) userdata is map that send to the api is adduser
                  } , // Call the registration function
                  child: const Text(
                    'Register', // Button text
                    style: TextStyle(color: Colors.white), // Text color
                  ),
                ),
              ],
            ),
          )
      ),
    );
  }
}