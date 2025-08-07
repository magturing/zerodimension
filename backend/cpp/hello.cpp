#include <iostream>
using namespace std;

int add(int x, int y) {
    return x + y;
}

int main(int argc, char* argv[]) {
    if (argc != 3) {
        cerr << "Usage: ./add <x> <y>" << endl;
        return 1;
    }

    int x = stoi(argv[1]);
    int y = stoi(argv[2]);

    cout << add(x, y) << endl; // 👈 This is what Node.js will capture
    return 0;
}
