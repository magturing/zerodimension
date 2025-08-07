
public class Add {
    public static void main(String[] args) {
        if (args.length != 2) {
            System.out.println("Usage: java Add <x> <y>");
            return;
        }

        int x = Integer.parseInt(args[0]);
        int y = Integer.parseInt(args[1]);

        System.out.println(x * y);
    }
}
