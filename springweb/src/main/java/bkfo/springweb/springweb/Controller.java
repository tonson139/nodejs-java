package bkfo.springweb.springweb;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

@RestController
@RequestMapping("/")
public class Controller {

    private final int delaySeconds = 3;

    @GetMapping
    public String home() {
        return "Hello World! " + new Date().toInstant().toString();
    }

    @GetMapping("/block/while-loop")
    public void blockWithWhileLoop() {
        timer(() -> {
            long startAt = System.currentTimeMillis();
            while ((System.currentTimeMillis() - startAt) / 1000 < delaySeconds) ;
        });
    }

    @GetMapping("/block/await-while-loop")
    public void blockWithAwaitWhileLoop() {
        timer(() -> {
            long startAt = System.currentTimeMillis();
            while ((System.currentTimeMillis() - startAt) / 1000 < delaySeconds) ;
        });
    }

    @GetMapping("/non-block/await")
    public void nonBlockWithAwait() {
        timer(() -> delay(delaySeconds));
    }

    private void timer(Runnable fn) {
        long startAt = System.currentTimeMillis();
        fn.run();
        long endAt = System.currentTimeMillis();
        logger(endAt - startAt);
    }

    private void logger(long duration) {
        System.out.println(new Date().toInstant().toString() + " - " + duration + " ms");
    }

    private void delay(int seconds) {
        try {
            Thread.sleep(seconds * 1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
