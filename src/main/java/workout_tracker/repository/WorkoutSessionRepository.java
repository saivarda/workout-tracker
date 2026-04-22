package workout_tracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import workout_tracker.model.WorkoutSession;
import java.time.LocalDate;
import java.util.List;

public interface WorkoutSessionRepository extends JpaRepository<WorkoutSession, Long> {
    List<WorkoutSession> findByDateBetween(LocalDate start, LocalDate end);
    List<WorkoutSession> findAllByOrderByDateDesc();
}
