package workout_tracker.service;

import org.springframework.stereotype.Service;
import workout_tracker.model.*;
import workout_tracker.repository.*;
import java.util.List;

@Service
public class WorkoutService {

    private final ExerciseRepository exerciseRepository;
    private final WorkoutSessionRepository sessionRepository;
    private final WorkoutSetRepository setRepository;

    public WorkoutService(ExerciseRepository exerciseRepository,
                          WorkoutSessionRepository sessionRepository,
                          WorkoutSetRepository setRepository) {
        this.exerciseRepository = exerciseRepository;
        this.sessionRepository = sessionRepository;
        this.setRepository = setRepository;
    }

    public List<Exercise> getAllExercises() { return exerciseRepository.findAll(); }
    public List<Exercise> getExercisesByMuscleGroup(String muscleGroup) { return exerciseRepository.findByMuscleGroup(muscleGroup); }
    public Exercise createExercise(Exercise exercise) { return exerciseRepository.save(exercise); }
    public List<WorkoutSession> getAllSessions() { return sessionRepository.findAllByOrderByDateDesc(); }
    public WorkoutSession getSessionById(Long id) { return sessionRepository.findById(id).orElseThrow(() -> new RuntimeException("Session not found")); }
    public WorkoutSession createSession(WorkoutSession session) { return sessionRepository.save(session); }
    public void deleteSession(Long id) { sessionRepository.deleteById(id); }
    public List<WorkoutSet> getSetsForSession(Long sessionId) { return setRepository.findByWorkoutSessionId(sessionId); }
    public List<WorkoutSet> getPersonalBests(Long exerciseId) { return setRepository.findByExerciseIdOrderByWorkoutSession_DateDesc(exerciseId); }

    public WorkoutSet addSetToSession(Long sessionId, Long exerciseId, WorkoutSet set) {
        WorkoutSession session = getSessionById(sessionId);
        Exercise exercise = exerciseRepository.findById(exerciseId).orElseThrow(() -> new RuntimeException("Exercise not found"));
        set.setWorkoutSession(session);
        set.setExercise(exercise);
        return setRepository.save(set);
    }
}
