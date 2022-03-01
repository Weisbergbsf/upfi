import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

interface CreateImageFormProps {
  url: string;
  title: string;
  description: string;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      required: { value: true, message: 'Arquivo obrigatório' },
      validate: {
        lessThan10MB: (image: { size: number }[]) => {
          const convertToMB = Math.round(image[0].size / 1024);
          return convertToMB > 10240
            ? 'O arquivo deve ser menor que 10MB'
            : null;
        },
        acceptedFormats: (image: { type: string }[]) => {
          const pattern = '(image)/(gif|png|jpeg)$';
          const regex = new RegExp(pattern).test(image[0].type);
          return regex ? null : 'Somente são aceitos arquivos PNG, JPEG e GIF';
        },
      },
    },
    title: {
      required: { value: true, message: 'Título obrigatório' },
      minLength: { value: 2, message: 'Mínimo de 2 caracteres' },
      maxLength: { value: 20, message: 'Máximo de 20 caracteres' },
    },
    description: {
      required: { value: true, message: 'Descrição obrigatória' },
      maxLength: { value: 65, message: 'Máximo de 65 caracteres' },
    },
  };

  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (image: CreateImageFormProps) => {
      await api.post('api/images', { ...image });
    },
    {
      onSuccess: () => queryClient.invalidateQueries('images'),
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  const { errors } = formState;

  const onSubmit: SubmitHandler<CreateImageFormProps> = async (
    data
  ): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          status: 'info',
          title: 'Imagem não adicionada',
          description:
            'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
        });
      }
      const values: CreateImageFormProps = {
        title: data.title,
        description: data.description,
        url: imageUrl,
      };

      await mutation.mutateAsync(values);

      toast({
        status: 'success',
        title: 'Imagem cadastrada',
        description: 'Sua imagem foi cadastrada com sucesso.',
      });
    } catch {
      toast({
        status: 'error',
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.',
      });
    } finally {
      reset();
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          name="image"
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          {...register('image', { ...formValidations.image })}
          error={errors.image}
        />

        <TextInput
          placeholder="Título da imagem..."
          name="title"
          {...register('title', { ...formValidations.title })}
          error={errors.title}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          name="description"
          {...register('description', { ...formValidations.description })}
          error={errors.description}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
