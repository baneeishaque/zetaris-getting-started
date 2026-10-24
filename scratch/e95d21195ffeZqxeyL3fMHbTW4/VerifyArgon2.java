import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import org.bouncycastle.crypto.generators.Argon2BytesGenerator;
import org.bouncycastle.crypto.params.Argon2Parameters;

public final class VerifyArgon2 {
    public static void main(String[] args) throws Exception {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in, StandardCharsets.UTF_8));
        String encoded = in.readLine();
        String password = in.readLine();
        if (encoded == null || password == null) {
            System.out.println("MISSING_INPUT");
            return;
        }
        String[] parts = encoded.split("\\$");
        if (parts.length != 6 || !"argon2id".equals(parts[1])) {
            System.out.println("UNSUPPORTED_HASH");
            return;
        }
        int version = Integer.parseInt(parts[2].substring(2));
        int memory = 0;
        int iterations = 0;
        int parallelism = 0;
        for (String pair : parts[3].split(",")) {
            String[] kv = pair.split("=", 2);
            switch (kv[0]) {
                case "m" -> memory = Integer.parseInt(kv[1]);
                case "t" -> iterations = Integer.parseInt(kv[1]);
                case "p" -> parallelism = Integer.parseInt(kv[1]);
                default -> { }
            }
        }
        byte[] salt = Base64.getDecoder().decode(pad(parts[4]));
        byte[] expected = Base64.getDecoder().decode(pad(parts[5]));
        Argon2Parameters params = new Argon2Parameters.Builder(Argon2Parameters.ARGON2_id)
                .withVersion(version)
                .withMemoryAsKB(memory)
                .withIterations(iterations)
                .withParallelism(parallelism)
                .withSalt(salt)
                .build();
        Argon2BytesGenerator generator = new Argon2BytesGenerator();
        generator.init(params);
        byte[] actual = new byte[expected.length];
        generator.generateBytes(password.toCharArray(), actual);
        System.out.println(MessageDigest.isEqual(expected, actual) ? "MATCH" : "NO_MATCH");
    }

    private static String pad(String value) {
        int remainder = value.length() % 4;
        if (remainder == 0) {
            return value;
        }
        return value + "=".repeat(4 - remainder);
    }
}
