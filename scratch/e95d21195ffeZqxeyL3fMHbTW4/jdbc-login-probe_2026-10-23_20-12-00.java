import java.sql.Connection;
import java.sql.DriverManager;
import java.util.Properties;

public class JdbcLoginProbe {
    public static void main(String[] args) throws Exception {
        Class.forName("com.zetaris.lightning.jdbc.LightningDriver");
        String url = System.getenv("ZETARIS_JDBC_URL");
        String user = System.getenv("ZETARIS_USERNAME");
        String pass = System.getenv(args[0]);
        Properties props = new Properties();
        props.setProperty("user", user);
        props.setProperty("password", pass);
        try (Connection connection = DriverManager.getConnection(url, props)) {
            System.out.println("OK");
        } catch (Exception ex) {
            System.out.println(ex.getClass().getSimpleName() + ": " + ex.getMessage());
        }
    }
}
