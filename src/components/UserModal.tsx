import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  useColorModeValue,
  useSteps,
} from "@chakra-ui/react";
import React, {
  forwardRef,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User } from "@/models/User";
import { userMutations } from "@/operations/mutations";
import { useRouter } from "next/navigation";

interface FocusableElement {
  focus(options?: FocusOptions): void;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: User;
}

const steps = [
  { title: "First", description: "Username" },
  { title: "Second", description: "Job title" },
];

const createUserFormSchema = z.object({
  username: z.string().regex(/^[A-Za-z]+$/i, "Only letters are allowed"),
  jobTitle: z
    .string()
    .regex(/^[A-Za-z\s]+$/i, "Only letters and spaces are allowed"),
});

const UserModal = forwardRef<FocusableElement, UserModalProps>(
  ({ isOpen, onClose, initialValues }, ref) => {
    const { push } = useRouter();
    const { activeStep, goToNext, setActiveStep } = useSteps({
      index: 1,
      count: steps.length,
    });

    const nextStepRef = useRef<HTMLButtonElement>(null);
    const submitButtonRef = useRef<HTMLButtonElement>(null);

    const inputColor = useColorModeValue("gray.800", "gray.200");
    const inputBgColor = useColorModeValue("gray.100", "gray.600");
    const inputFocusBgColor = useColorModeValue("gray.200", "gray.800");

    const {
      register,
      handleSubmit,
      setError,
      getValues,
      reset,
      formState: { errors, isSubmitting, isSubmitSuccessful },
    } = useForm<User>({
      defaultValues: {
        username: "",
        jobTitle: "",
      },
      resolver: zodResolver(createUserFormSchema),
    });

    const onCloseModal = useCallback(() => {
      onClose();
      reset({ username: "", jobTitle: "" });
      setActiveStep(1);
    }, [onClose, reset, setActiveStep]);

    const onNextStep = () => {
      const { username } = getValues();
      const result = z
        .string()
        .regex(/^[A-Za-z]+$/i)
        .safeParse(username);

      if (!result.success) {
        setError("username", {
          type: "invalid",
          message: "Username is required and should only contain letters",
        });
        return;
      }

      return goToNext();
    };

    const onSubmit = async (data: User) => {
      userMutations.mutateUser(data);
    };

    useEffect(() => {
      if (isSubmitSuccessful) {
        onCloseModal();
        push("/dashboard");
      }
    }, [isSubmitSuccessful, onCloseModal, push]);

    useEffect(() => {
      if (initialValues) {
        reset(initialValues);
      }
    }, [initialValues, reset]);

    return (
      <Modal
        finalFocusRef={ref as React.RefObject<FocusableElement>}
        isOpen={isOpen}
        onClose={onCloseModal}
        isCentered
        data-testid="user-modal"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Credentials</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDirection={"column"} gap={10}>
            <Stepper index={activeStep}>
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepIndicator>
                    <StepStatus
                      complete={<StepIcon />}
                      incomplete={<StepNumber />}
                      active={<StepNumber />}
                    />
                  </StepIndicator>

                  <Box flexShrink="0">
                    <StepTitle>{step.title}</StepTitle>
                    <StepDescription>{step.description}</StepDescription>
                  </Box>

                  <StepSeparator />
                </Step>
              ))}
            </Stepper>
            {activeStep === 1 ? (
              <FormControl isInvalid={errors.username ? true : false}>
                <FormLabel>Username</FormLabel>
                <Input
                  type={"text"}
                  placeholder={"johnamorim"}
                  color={inputColor}
                  bg={inputBgColor}
                  rounded={"full"}
                  border={0}
                  _focus={{
                    bg: inputFocusBgColor,
                    outline: "none",
                  }}
                  {...register("username", { required: true })}
                  onKeyDownCapture={(e) => {
                    if (e.key === "Enter" && nextStepRef.current) {
                      nextStepRef.current.click();
                    }
                  }}
                />
                {errors.username && (
                  <FormErrorMessage>{errors.username.message}</FormErrorMessage>
                )}
              </FormControl>
            ) : (
              <FormControl isInvalid={errors.jobTitle ? true : false}>
                <FormLabel>Job title</FormLabel>
                <Input
                  {...register("jobTitle", { required: true })}
                  type={"text"}
                  placeholder={"Software Developer"}
                  color={inputColor}
                  bg={inputBgColor}
                  rounded={"full"}
                  border={0}
                  _focus={{
                    bg: inputFocusBgColor,
                    outline: "none",
                  }}
                  onKeyDownCapture={(e) => {
                    if (e.key === "Enter" && submitButtonRef.current) {
                      submitButtonRef.current.click();
                    }
                  }}
                />
                {errors.jobTitle && (
                  <FormErrorMessage>{errors.jobTitle.message}</FormErrorMessage>
                )}
              </FormControl>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant={"ghost"} mr={3} onClick={onCloseModal}>
              Close
            </Button>
            {activeStep === 1 ? (
              <Button colorScheme="blue" onClick={onNextStep} ref={nextStepRef}>
                Next Step
              </Button>
            ) : (
              <Button
                colorScheme="blue"
                disabled={isSubmitting}
                onClick={handleSubmit(onSubmit)}
                ref={submitButtonRef}
              >
                Done
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
);

UserModal.displayName = "UserModal";

export default UserModal;
